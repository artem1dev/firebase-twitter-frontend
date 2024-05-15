import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";

import routes from "../../routes.js";

export const fetchUserInfo = createAsyncThunk("users/getUserById", async (id) => {
    const response = await axios.get(routes.getUserById(id));
    return response.data;
});

export const fetchUsers = createAsyncThunk("users/getAllUsers", async (token) => {
    const response = await axios.get(routes.getAllUsers(token));
    return response.data;
});

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
    currentUser: "guest",
    isLogin: false,
    loadingStatus: "loading",
    error: null,
    massage: "",
});

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.isLogin = true;
            })
            .addCase(fetchUserInfo.fulfilled, (state, { payload }) => {
                state.isLogin = false;
                state.entities[payload[0].id] = payload[0];
            })
            .addCase(fetchUserInfo.rejected, (state, { payload }) => {
                state.isLogin = false;
                state.error = payload.error;
            })
            .addCase(fetchUsers.fulfilled, (state, { payload }) => {
                payload.map((user) => (state.entities[user.id] = user));
            });
    },
});

export const { actions } = usersSlice;
export const userSelectors = usersAdapter.getSelectors((state) => state.users);
export default usersSlice.reducer;
