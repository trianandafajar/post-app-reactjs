import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

// Thunk
export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async () => {
    const res = await axios.get("/categories");
    return res.data;
  }
);

// Adapter
const categoryAdapter = createEntityAdapter({
  selectId: (category) => category.id,
});

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState: categoryAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        categoryAdapter.setAll(state, action.payload);
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Selectors
export const {
  selectAll: selectAllCategory,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
} = categoryAdapter.getSelectors((state) => state.category);

// Reducer
export default categorySlice.reducer;