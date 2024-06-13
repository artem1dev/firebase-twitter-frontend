import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "./Post.jsx";
import axios from "axios";
import routes from "../routes.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config.js";
import { v4 as uuidv4 } from "uuid";

export default function Profile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState("");
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState(null);
    const { currentUser, token } = JSON.parse(localStorage.getItem("currentUser"));
    useEffect(() => {
        const fetchPostsByUserId = async (userId) => {
            const response = await axios.get(routes.getPostsByUserId(userId));
            return response.data;
        };
        fetchPostsByUserId(id).then((data) => {
            setUserPosts(data);
        });
        const fetchUserInfo = async (userId) => {
            const response = await axios.get(routes.getUserById(userId));
            return response.data;
        };
        fetchUserInfo(id).then((data) => {
            setUser(data);
            const imageRef = ref(storage, `avatars/${data?.profilePic}`);
            getDownloadURL(imageRef)
                .then((url) => {
                    setImageUrl(url);
                })
                .catch((error) => {
                    console.error("Error fetching image:", error);
                });
        });
    }, [, id]);

    const [editUserName, setEditDataName] = useState("");
    const [editUserLastName, setEditDataLastName] = useState("");
    const [isEdit, setEdit] = useState(false);
    useEffect(() => {
        if (user?.name !== undefined) {
            setEditDataName(user?.name);
        }
        if (user?.lastname !== undefined) {
            setEditDataLastName(user?.lastname);
        }
    }, [user]);

    const editProfile = async (values) => {
        setEdit(false);
        // window.location.reload(false);
        await axios.put(
            routes.updateUserById(id),
            {
                name: editUserName,
                lastname: editUserLastName,
            },
            {
                headers: {
                    authorization: token,
                },
            },
        );
        window.location.reload();
    };

    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileName = uuidv4();
            const storageRef = ref(storage, `avatars/${fileName}`);
            await uploadBytes(storageRef, file);
            await axios.put(
                routes.updateUserById(id),
                {
                    profilePic: fileName,
                },
                {
                    headers: {
                        authorization: token,
                    },
                },
            );
            window.location.reload();
        }
    };

    return (
        <>
            <div className="divProfileBlock">
                <div className="ProfileForm">
                    <div>
                        <div className="top-block">
                            <h1>
                                {user?.name} {user?.lastname}
                            </h1>
                            <span className="roleTitle">{user?.role} </span>
                        </div>
                        {imageUrl ? (
                            <img className="profimg" onClick={handleImageClick} alt="" src={imageUrl} />
                        ) : (
                            <p>Loading...</p>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <div>
                        <div>
                            <span>About</span>
                            <div>
                                <div className="profileitem">
                                    Email: <span>{user?.email}</span>
                                </div>
                            </div>
                        </div>
                        {currentUser?.userId === id ? (
                            <button
                                onClick={async () => {
                                    await axios.delete(routes.deleteUserById(id), {
                                        headers: {
                                            authorization: token,
                                        },
                                    });
                                    localStorage.setItem("currentUser", JSON.stringify({ currentUser: "guest" }));
                                    navigate("/");
                                    window.location.reload();
                                }}
                                className="Submit_btn"
                            >
                                Delete user
                            </button>
                        ) : (
                            ""
                        )}
                        {currentUser?.userId === id ? (
                            isEdit ? (
                                <>
                                    <form onSubmit={editProfile} className="EditPostForm">
                                        <textarea
                                            id="edit_title"
                                            className="edit_title"
                                            name="edit_title"
                                            type="text"
                                            onChange={(e) => setEditDataName(e.target.value)}
                                            value={editUserName}
                                        />
                                        <textarea
                                            id="edit_content"
                                            className="edit_title"
                                            name="edit_content"
                                            type="text"
                                            onChange={(e) => setEditDataLastName(e.target.value)}
                                            value={editUserLastName}
                                        />
                                        <div className="EditPostBtnBlock">
                                            <button type="submit" className="SaveEdit_btn">
                                                Save edit
                                            </button>
                                            <button onClick={() => setEdit(false)} className="CancelEdit_btn">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div>
                                    <button className="EditPost_btn" onClick={() => setEdit(true)}>
                                        Edit
                                    </button>
                                </div>
                            )
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="All_Posts">
                {userPosts?.map((post) => (
                    <Post post={post} />
                ))}
            </div>
        </>
    );
}
