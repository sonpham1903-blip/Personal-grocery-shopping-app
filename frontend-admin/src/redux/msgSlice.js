import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMsg: null,
  currentPage: null,
};

export const msgSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMsg: (state, action) => {
      state.currentMsg = action.payload;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setMsg, setPage } = msgSlice.actions;

export default msgSlice.reducer;
