import React from "react";
import { useDispatch, useSelector } from "react-redux";

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
    return `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;
};

const hiddenText = (text) => {
    const newText = text.length > 140 ? text.slice(0, 140) + "..." : text;
    return newText;
};

export default function Post({ post }) {
    const dispatch = useDispatch();
    const { currentUser, token } = JSON.parse(localStorage.getItem("currentUser"));
    const users = useSelector((state) => state.users.entities);
    return (
        post && (
            <div key={post.id} className="PostBlock">
                <div className="postContent">
                    <div>
                        <div>
                            <h5>{post?.title}</h5>
                        </div>
                        <p>
                            By <a href={`/profile/${post?.userId}`}>{post?.authorLogin + " "}</a>
                        </p>
                    </div>
                    <div>
                        <p>{post?.content?.length < 329 ? post?.content : hiddenText(post?.content)}</p>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>Published: {normalizaDate(post?.createdAt)}</div>
                            </div>
                            <div>
                                <div>
                                    <img src="/comment.png" className="userimg" />
                                    <span>{" " + post?.commentsCount}</span>
                                </div>
                                <div>
                                    <img src="/like.png" className="userimg" />
                                    <span>{" " + post?.likeCount}</span>
                                </div>
                                <div>
                                    <img src="/dislike.png" className="userimg" />
                                    <span>{" " + post?.dislikeCount}</span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div>
                            <a href={`/post/${post?._id}`}>
                                <button type="submit" className="Submit_btn">
                                    Reading
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
