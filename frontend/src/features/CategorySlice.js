import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal mengambil kategori");
    }
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/categories", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal menambah kategori");
    }
  }
);

const categoryEntity = createEntityAdapter({
  selectId: (category) => category.id,
});

const categorySlice = createSlice({
  name: "category",
  initialState: categoryEntity.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Categories
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        categoryEntity.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        categoryEntity.addOne(state, action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const categorySelectors = categoryEntity.getSelectors(
  (state) => state.category
);

export default categorySlice.reducer;
