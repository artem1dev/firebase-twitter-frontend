import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import routes from "../../routes.js";

export const fetchPosts = createAsyncThunk("posts/allPost", async () => {
    const response = await axios.get(routes.allPost());
    return response.data.values;
});

export const fetchInfoPost = createAsyncThunk("posts/getPostById", async (postId) => {
    const response = await axios.get(routes.getPostsById(postId));
    return response.data.values;
});

export const fetchPostComments = createAsyncThunk("posts/postComments", async (id) => {
    const response = await axios.get(routes.commentsPost(id));
    return response.data.values;
});

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState({
    postLikes: {},
    postComments: {},
    error: null,
    loading: true,
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: postsAdapter.addOne,
        updatePost: postsAdapter.updateOne,
        setCurrentPage(state, { payload }) {
            state.currentPage = payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPosts.fulfilled, (state, { payload }) => {
                state.loading = false;
                postsAdapter.addMany(state, payload);
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.loading = false;
                state.error = "Error load post try later :(";
            })
            .addCase(fetchPostComments.fulfilled, (state, { payload }) => {
                state.postComments[payload.postId] = {
                    countComments: payload.length,
                    comments: payload,
                };
            })
            .addCase(fetchInfoPost.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(fetchInfoPost.fulfilled, (state, { payload }) => {
                state.entities[payload[0].id] = payload[0];
                state.loading = false;
            })
            .addCase(fetchInfoPost.rejected, (state) => {
                state.error = "This page not found";
                state.loading = false;
            });
    },
});

export const { actions } = postsSlice;

export const selectors = postsAdapter.getSelectors((state) => state.posts);

export const getFetchStatus = (state) => state.posts.loading;

export default postsSlice.reducer;
