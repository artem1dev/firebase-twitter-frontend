import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

import NotFound from "./404";
import routes from "../routes.js";
import CommentsPost from "./CommentsPost.jsx";
import CreateCommentPost from "./CreateCommentPost";

export default function FullPost() {
    const { currentUser, token } = JSON.parse(localStorage.getItem("currentUser"));
    const dispatch = useDispatch();
    const postId = useParams().id;
    const [post, setPosts] = useState(null);
    useEffect(() => {
        const fetchInfoPost = async (postId) => {
            const response = await axios.get(routes.getPostsById(postId));
            return response.data.values;
        };
        fetchInfoPost(postId).then((data) => {
            setPosts(data);
            console.log(data);
        });
    }, []);
    const error = useSelector((state) => state.posts.error);
    const [editData, setEditData] = useState("");
    const [isEdite, setEdite] = useState(false);
    useEffect(() => {
        if (post?.content !== undefined) {
            setEditData(post?.content);
        }
    }, [post]);

    const editePost = async (values) => {
        setEdite(false);
        window.location.reload(false);
        await axios.patch(
            routes.updatePost(postId),
            {
                userId: currentUser.userData.userId,
                content: values.edit_content,
            },
            {
                headers: {
                    authorization: token,
                },
            },
        );
        window.location.reload();
    };

    return error ? (
        <NotFound />
    ) : (
        <div className="FullPostBlock">
            <div className="FullPostContent">
                <h1 className="FullPostTitle">{post?.title}</h1>
                <hr className="bg-white" />
                <div className="FullPostText">
                    <p>{post?.content}</p>
                    {currentUser.userData.userId === post?.userId ? (
                        isEdite ? (
                            <>
                                <form onSubmit={editePost} className="EditPostForm">
                                    <textarea
                                        id="edit_content"
                                        className="edit_content"
                                        name="edit_content"
                                        type="text"
                                        onChange={(e) => setEditData(e.target.value)}
                                        value={editData}
                                    />
                                    <div className="EditPostBtnBlock">
                                        <button type="submit" className="SaveEdit_btn">
                                            Save edit
                                        </button>
                                        <button onClick={() => setEdite(false)} className="CancelEdit_btn">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div>
                                <button className="EditPost_btn" onClick={() => setEdite(true)}>
                                    Edit
                                </button>
                            </div>
                        )
                    ) : null}
                </div>

                <div>
                    <p>
                        <button
                            onClick={async () => {
                                const response = await axios.post(
                                    routes.createPostLike(postId),
                                    {
                                        like: true,
                                    },
                                    {
                                        headers: {
                                            authorization: token,
                                        },
                                    },
                                );
                                window.location.reload();
                            }}
                        >
                            <img src="/like.png" className="userimg" />
                        </button>
                        {post?.likeCount}
                    </p>
                    <p>
                        <button
                            onClick={async () => {
                                const response = await axios.post(
                                    routes.createPostLike(postId),
                                    {
                                        like: false,
                                    },
                                    {
                                        headers: {
                                            authorization: token,
                                        },
                                    },
                                );
                                window.location.reload();
                            }}
                        >
                            <img src="/dislike.png" className="userimg" />
                        </button>
                        {post?.dislikeCount}
                    </p>
                </div>
                <h2>Comments</h2>
                <hr className="bg-white" />
                <CreateCommentPost postId={postId}/>
                <div className="FullPostComment">
                    <ul>
                        {post?.comments.map((comment) => {
                            return (
                                <li key={comment._id}>
                                    <CommentsPost
                                        idComment={comment._id}
                                        comment={comment}
                                        users={comment.login}
                                        token={token}
                                        postId={postId}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
