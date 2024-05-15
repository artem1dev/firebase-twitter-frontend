import React from "react";
import routes from "../routes.js";
import axios from "axios";
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

export default function CommentsPost({ idComment, comment, users, token, postId }) {
    return (
        <div>
            <div className="Comment_Block">
                <div className="Comment_Header">
                    <a href={`/profile/${comment?.userId}`}>
                        <span>
                            <img className="commentimg" src="/avatars/default.png" />
                            {users ? " " + users : null}
                        </span>
                    </a>
                    <span>{normalizaDate(comment?.createdAt)}</span>
                </div>
                <div className="">
                    <p>{comment?.content}</p>
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
                    </p>
                </div>
            </div>
            <div>
                {comment.replies && comment.replies.length > 0 && (
                        <ul>
                            {comment.replies.map((reply) => (
                                <li key={reply._id}>
                                    <CommentsPost
                                        idComment={reply._id}
                                        comment={reply}
                                        users={reply.login}
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
