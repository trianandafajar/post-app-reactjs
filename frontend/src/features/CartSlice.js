import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Ambil data cart
export const getCart = createAsyncThunk("cart/getCart", async () => {
  const response = await axios.get("/carts");
  return response.data;
});

// Tambah item ke cart
export const inputCart = createAsyncThunk("cart/inputCart", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post("/carts", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error menambah cart");
  }
});

// Perbarui item di cart
export const updateCart = createAsyncThunk("cart/updateCart", async (data, { rejectWithValue }) => {
  try {
    await axios.put(`/carts/${data.id}`, data);
    return data; // Langsung update state tanpa fetch ulang
  } catch (error) {
    return rejectWithValue(error.response?.data || "Gagal memperbarui cart");
  }
});

// Hapus item dari cart
export const delCart = createAsyncThunk("cart/delCart", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/carts/${id}`);
    return id; // Hanya kembalikan ID yang dihapus
  } catch (error) {
    return rejectWithValue(error.response?.data || "Gagal menghapus item");
  }
});

// Simpan order dan kosongkan cart
export const saveOrder = createAsyncThunk("cart/saveOrder", async (_, { rejectWithValue }) => {
  try {
    await axios.post("/orders");
    
    const { data: cart } = await axios.get("/carts");

    // Hapus semua item di cart secara paralel
    await Promise.all(cart.map((item) => axios.delete(`/carts/${item.id}`)));

    return []; // Kosongkan cart di state tanpa perlu fetching ulang
  } catch (error) {
    return rejectWithValue(error.response?.data || "Gagal menyimpan order");
  }
});

// Set detail untuk edit cart
export const setDetail = createAsyncThunk("cart/setDetail", async (data) => {
  return data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: [],
    loading: false,
    error: null,
    dataEdit: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Input Cart
      .addCase(inputCart.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(inputCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Update Cart
      .addCase(updateCart.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
        state.loading = false;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Delete Cart
      .addCase(delCart.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(delCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Save Order
      .addCase(saveOrder.fulfilled, (state) => {
        state.data = []; // Kosongkan cart setelah order
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Set Detail
      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      });
  },
});

export default cartSlice.reducer;
