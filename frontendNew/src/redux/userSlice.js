import { createSlice } from "@reduxjs/toolkit";

const storedUser = (() => {
  try {
    const rawUser = localStorage.getItem("currentUser");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    return null;
  }
})();

const initialState = {
  currentUser: storedUser,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, subscription } =
  userSlice.actions;

export default userSlice.reducer;
