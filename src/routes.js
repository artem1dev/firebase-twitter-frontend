const apiUrl = "http://localhost:8080";

export default {
    registerPath: () => [apiUrl, "auth", "register"].join("/"),
    authPath: () => [apiUrl, "auth", "login"].join("/"),
    getUserById: (id) => [apiUrl, "user", id].join("/"),
    deleteUserById: (id) => [apiUrl, "user", id].join("/"),
    allPost: () => [apiUrl, "post"].join("/"),
    updatePost: (id) => [apiUrl, "post", id].join("/"),
    deletePost: (id) => [apiUrl, "post", id].join("/"),
    getPostsById: (id) => [apiUrl, "post", id].join("/"),
    getPostsByUserId: (id) => [apiUrl, "post", "user", id].join("/"),
    createPost: (token) => [apiUrl, "post"].join("/"),
    createPostComment: () => [apiUrl, "comment"].join("/"),
    getPhoto: (name) => ["http://localhost:8080", "avatars", name].join("/"),
    createPostLike: (id) => [apiUrl, "post", id, "like"].join("/"),
    createCommentLike: (id) => [apiUrl, "comment", id, "like"].join("/"),
};
