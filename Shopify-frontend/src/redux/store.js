import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../slices/productSlice";
import userReducer from "../slices/userSlice";
import orderReducer from "../slices/orderSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    order: orderReducer,
  },
});

export default store;
