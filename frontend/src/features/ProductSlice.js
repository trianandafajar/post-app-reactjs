import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal mengambil produk");
    }
  }
);

export const getProductByCategory = createAsyncThunk(
  "product/getProductByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/products?category_id=${category}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Gagal mengambil produk berdasarkan kategori");
    }
  }
);

// Entity Adapter
const productEntity = createEntityAdapter({
  selectId: (product) => product.id,
});

// Product Slice
const productSlice = createSlice({
  name: "product",
  initialState: productEntity.getInitialState({
    loading: false,
    error: null,
    filteredData: null, // Untuk menyimpan hasil filter kategori
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        productEntity.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Products by Category
      .addCase(getProductByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.filteredData = action.payload;
        state.loading = false;
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const productSelectors = productEntity.getSelectors(
  (state) => state.product
);

export default productSlice.reducer;
