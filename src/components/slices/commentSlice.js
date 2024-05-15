import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import routes from "../../routes.js";
import _ from "lodash";

export const fetchAllCommentPost = createAsyncThunk("categories/allCommentPost", async (id) => {
    const response = await axios.get(routes.commentsPost(id));
    return response.data;
});

const commentAdapter = createEntityAdapter();

const initialState = commentAdapter.getInitialState({
    error: null,
    loading: true,
    commentLike: {},
    countLike: 0,
});

const commentSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addComment: commentAdapter.addOne,
        updateComment: commentAdapter.updateOne,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllCommentPost.fulfilled, (state, { payload }) => {
            commentAdapter.addMany(state, payload);
        });
    },
});

export const { actions } = commentSlice;

export const selectorsComment = commentAdapter.getSelectors((state) => state.comments);
export const getFetchStatus = (state) => state.comments.loading;

export default commentSlice.reducer;
