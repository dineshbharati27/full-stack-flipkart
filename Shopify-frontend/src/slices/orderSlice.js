import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
    },
    placeOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    removeOrderedProductFromCart: (state, action) => {
      const orderedProductId = action.payload; // Product ID to remove
      const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage

      if (user && user.cart) {
        user.cart = user.cart.filter((item) => item.productId !== orderedProductId);
        localStorage.setItem("user", JSON.stringify(user)); // Update localStorage
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setOrders, placeOrder, removeOrderedProductFromCart, setLoading, setError } =
  orderSlice.actions;
export default orderSlice.reducer;
