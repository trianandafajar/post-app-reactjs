import { configureStore } from "@reduxjs/toolkit";
import category from "../features/CategorySlice";
import product from "../features/ProductSlice";
import cart from "../features/CartSlice";

export const store = configureStore({
  reducer: {
    category,
    product,
    cart,
  },
});
