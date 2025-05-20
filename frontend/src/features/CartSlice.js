import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getCart = createAsyncThunk("cart/getCart", async () => {
  const res = await axios.get("/carts");
  return res.data;
});

export const inputCart = createAsyncThunk("cart/inputCart", async (data) => {
  await axios.post("/carts", data);
  return await getCartThunk();
});

export const updateCart = createAsyncThunk("cart/updateCart", async (data) => {
  await axios.put(`/carts/${data.id}`, data);
  return await getCartThunk();
});

export const delCart = createAsyncThunk("cart/delCart", async (id) => {
  await axios.delete(`/carts/${id}`);
  return await getCartThunk();
});

export const updCart = createAsyncThunk("cart/updCart", async (data) => {
  data.totalPrice = data.qty * data.price;
  await axios.put(`/carts/${data.id}`, data);
  return await getCartThunk();
});

export const saveOrder = createAsyncThunk("cart/saveOrder", async (data) => {
  await axios.post("/orders", data);
  const cartRes = await axios.get("/carts");
  await Promise.all(
    cartRes.data.map((item) => axios.delete(`/carts/${item.id}`))
  );
  return [];
});

export const setDetail = createAsyncThunk(
  "cart/setDetail",
  async (data) => data
);

// Helper
const getCartThunk = async () => {
  const res = await axios.get("/carts");
  return res.data;
};

// Reusable state handler
const setPending = (state) => {
  state.loading = true;
  state.error = null;
};
const setRejected = (state, action) => {
  state.loading = false;
  state.error = action.error.message;
};

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
      // getCart
      .addCase(getCart.pending, setPending)
      .addCase(getCart.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getCart.rejected, setRejected)

      // inputCart
      .addCase(inputCart.pending, setPending)
      .addCase(inputCart.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(inputCart.rejected, setRejected)

      // updateCart
      .addCase(updateCart.pending, setPending)
      .addCase(updateCart.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateCart.rejected, setRejected)

      // delCart
      .addCase(delCart.fulfilled, (state, action) => {
        state.data = action.payload;
      })

      // updCart
      .addCase(updCart.fulfilled, (state, action) => {
        state.data = action.payload;
      })

      // saveOrder
      .addCase(saveOrder.pending, setPending)
      .addCase(saveOrder.fulfilled, (state) => {
        state.loading = false;
        state.data = [];
      })
      .addCase(saveOrder.rejected, setRejected)

      // setDetail
      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      });
  },
});

export default cartSlice.reducer;
