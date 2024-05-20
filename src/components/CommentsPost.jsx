import React, { useState, useEffect } from "react";
import routes from "../routes.js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CreateReplyCommentPost from "./CreateReplyCommentPost";

const normalizaDate = (date) => {
    const currentDate = new Date(date);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return `${currentDate.getDate()} ${
        monthNames[currentDate.getMonth()]
    }, ${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
};

export default function CommentsPost({ idComment, comment, userName, userLastname, token, postId }) {
    const { currentUser } = JSON.parse(localStorage.getItem("currentUser"));
    const [editCommentContent, setEditCommentContent] = useState("");
    const [isEdit, setEdit] = useState(false);
    useEffect(() => {
        if (comment?.content !== undefined) {
            setEditCommentContent(comment?.content);
        }
    }, [comment]);

    const editComment = async (values) => {
        setEdit(false);
        window.location.reload(false);
        await axios.put(
            routes.updatePostComment(idComment),
            {
                content: editCommentContent,
            },
            {
                headers: {
                    authorization: token,
                },
            },
        );
        window.location.reload();
    };

    return (
        <div>
            <div className="Comment_Block">
                <div className="Comment_Header">
                    <a href={`/profile/${comment?.userId}`}>
                        <span>
                            <img className="commentimg" src="/avatars/default.png" />
                            {userName && userLastname ? " " + `${userName} ${userLastname}` : null}
                        </span>
                    </a>
                    <span>{normalizaDate(comment?.createdAt)}</span>
                </div>
                <div className="">
                    <p>{comment?.content}</p>
                    {currentUser?.userId === comment?.userId ? (
                        isEdit ? (
                            <>
                                <form onSubmit={editComment} className="EditPostForm">
                                    <textarea
                                        id="edit_content"
                                        className="edit_content"
                                        name="edit_content"
                                        type="text"
                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                        value={editCommentContent}
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
                                    <img src="/pen.png" className="userimg" />
                                </button>
                            </div>
                        )
                    ) : null}
                </div>
                <div className="">
                    <CreateReplyCommentPost postId={postId} parentId={idComment}/>
                </div>
                <div>
                    <p>
                        <button
                            onClick={async () => {
                                const response = await axios.post(
                                    routes.createCommentLike(idComment),
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
                        {comment?.likeCounts}
                        <button
                            onClick={async () => {
                                const response = await axios.post(
                                    routes.createCommentLike(idComment),
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
                        {comment?.dislikeCounts}
                        {currentUser?.userId === comment?.userId ? (
                            <>
                                <button
                                    onClick={async () => {
                                        const response = await axios.delete(
                                            routes.deletePostComment(idComment),
                                            {
                                                headers: {
                                                    authorization: token,
                                                },
                                            },
                                        );
                                        window.location.reload();
                                    }}
                                >
                                    <img src="/trash.png" className="userimg" />
                                </button>
                            </>
                        ) : null}
                    </p>
                </div>
            </div>
            <div>
                {comment.replies && comment.replies.length > 0 && (
                        <ul>
                            {comment.replies.map((reply) => (
                                <li key={reply._id}>
                                    <CommentsPost
                                        idComment={reply.id}
                                        comment={reply}
                                        userName={reply.name}
                                        userLastname={reply.lastname}
                                        token={token}
                                        postId={postId}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </div>
    );
}
