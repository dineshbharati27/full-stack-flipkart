import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProductId: null, // Add selectedProductId to track the selected product
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    setSelectedProductId: (state, action) => {
      state.selectedProductId = action.payload; // Set selected product ID
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

export const { setProducts, addProduct, setSelectedProductId, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;
