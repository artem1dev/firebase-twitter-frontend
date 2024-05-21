import React, { useEffect, useState } from "react";
import axios from "axios";
import routes from "../routes.js";
import Post from "./Post.jsx";

export default function Home() {
    const [posts, setPosts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchPosts = async (page) => {
            const response = await axios.get(routes.allPost(), {
                params: { page, limit: 3 }
            });
            return response.data;
        };

        fetchPosts(currentPage).then(data => {
            setPosts(data.data);
            setTotalPages(data.totalPages);
        });
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            {posts && (
                <>
                    <div className="All_Posts">
                        {posts.map((post) => (
                            <Post post={post} />
                        ))}
                    </div>
                </>
            )}
            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            disabled={currentPage === index + 1}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
