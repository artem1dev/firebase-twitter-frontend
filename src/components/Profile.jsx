import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "./Post.jsx";
import axios from "axios";
import routes from "../routes.js";

export default function Profile() {
    const navigate = useNavigate();
    const { id } = useParams();
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
        });
    }, []);

    return (
        <>
            <div className="divProfileBlock">
                <div className="ProfileForm">
                    <div>
                        <div className="top-block">
                            <h1>{user?.name} {user?.lastname}</h1>
                            <span className="roleTitle">{user?.role} </span>
                        </div>
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
                            <button onClick={async () => {
                                    const response = await axios.delete(
                                        routes.deleteUserById(id),
                                        {
                                            headers: {
                                                authorization: token,
                                            },
                                        },
                                    );
                                    localStorage.setItem("currentUser", JSON.stringify({ currentUser: "guest" }));
                                    navigate("/");
                                    window.location.reload();
                                }}
                                className="Submit_btn">
                                    Delete user
                                </button>
                            ) : ""}
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
