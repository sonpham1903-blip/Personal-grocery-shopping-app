import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    setQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      item.quantity += 1;
    },
    updateQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (!item) {
        return;
      }

      item.quantity = Math.max(1, Number(action.payload.quantity) || 1);
    },
    removeItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, updateQuantity, removeItem, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
