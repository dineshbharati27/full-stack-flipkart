import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;

// Async function to fetch user data from database
export const fetchUser = (userId, token) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.post(
      "https://shopify-backend-703c.onrender.com/api/user",
      { userId }, // Send userId in the request body
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(setUser({ user: res.data, token }));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Error fetching user"));
  }
};

