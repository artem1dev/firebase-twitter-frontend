import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import routes from "../../routes.js";

export const fetchAllCategory = createAsyncThunk("categories/allCategories", async (token) => {
    const response = await axios.get(routes.allCategory(token));
    return response.data;
});

const categoryAdapter = createEntityAdapter();

const initialState = categoryAdapter.getInitialState({
    error: null,
    loading: true,
});

const categoriesSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllCategory.fulfilled, (state, { payload }) => {
            categoryAdapter.addMany(state, payload);
        });
    },
});

export const { action } = categoriesSlice;

export const selectorsCategoty = categoryAdapter.getSelectors((state) => state.categories);
export const getFetchStatus = (state) => state.categories.loading;

export default categoriesSlice.reducer;
