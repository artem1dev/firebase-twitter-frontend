import React, { useEffect, useState } from "react";
import axios from "axios";
import routes from "../routes.js";
import Post from "./Post.jsx";

export default function Home() {
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get(routes.allPost());
            return response.data.values;
        };
        fetchPosts().then((data) => {
            setPosts(data);
        });
    }, []);

    return (
        posts && (
            <>
                <div className="All_Posts">
                    {posts.map((post) => (
                        <Post post={post} />
                    ))}
                </div>
            </>
        )
    );
}
