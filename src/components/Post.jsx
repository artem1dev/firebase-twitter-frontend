import React from "react";

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
    return (
        post && (
            <div key={post.id} className="PostBlock">
                <div className="postContent">
                    <div>
                        <div>
                            <h5>{post?.title}</h5>
                        </div>
                        <p>
                            By <a href={`/profile/${post?.userId}`}>{post?.authorName + " " + post?.authorLastName + " "}</a>
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
                                    <img alt="some" src="/comment.png" className="userimg" />
                                    <span>{" " + post?.commentsCount}</span>
                                </div>
                                <div>
                                    <img alt="some" src="/like.png" className="userimg" />
                                    <span>{" " + post?.likeCount}</span>
                                </div>
                                <div>
                                    <img alt="some" src="/dislike.png" className="userimg" />
                                    <span>{" " + post?.dislikeCount}</span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div>
                            <a href={`/post/${post?.id}`}>
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
