const apiUrl = process.env.REACT_APP_BACKENDHOST;

const routes = {
    registerPath: () => [apiUrl, "auth", "register"].join("/"),
    authPath: () => [apiUrl, "auth", "login"].join("/"),
    authByGooglePath: () => [apiUrl, "auth", "loginByGoogle"].join("/"),
    getUserById: (id) => [apiUrl, "user", id].join("/"),
    updateUserById: (id) => [apiUrl, "user", id].join("/"),
    deleteUserById: (id) => [apiUrl, "user", id].join("/"),
    allPost: () => [apiUrl, "post"].join("/"),
    findPost: () => [apiUrl, "post", "search"].join("/"),
    updatePost: (id) => [apiUrl, "post", id].join("/"),
    deletePost: (id) => [apiUrl, "post", id].join("/"),
    getPostsById: (id) => [apiUrl, "post", id].join("/"),
    getPostsByUserId: (id) => [apiUrl, "post", "user", id].join("/"),
    createPost: (token) => [apiUrl, "post"].join("/"),
    createPostComment: () => [apiUrl, "comment"].join("/"),
    updatePostComment: (id) => [apiUrl, "comment", id].join("/"),
    deletePostComment: (id) => [apiUrl, "comment", id].join("/"),
    getPhoto: (name) => [apiUrl, "avatars", name].join("/"),
    createPostLike: (id) => [apiUrl, "post", id, "like"].join("/"),
    createCommentLike: (id) => [apiUrl, "comment", id, "like"].join("/"),
    uploadPhoto: () => [apiUrl, "user", "avatar"].join("/"),
};

export default routes;