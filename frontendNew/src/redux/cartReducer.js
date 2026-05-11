import { createSlice } from "@reduxjs/toolkit";
import ktsRequest from "../../ultis/ktsrequest";

const initialState = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.products = action.payload || [];
    },
    addLocal: (state, action) => {
      const item = state.products.find((it) => it.id === action.payload.id);
      if (item) item.quantity += action.payload.quantity;
      else state.products.push(action.payload);
    },
    updateQuantityLocal: (state, action) => {
      const item = state.products.find((it) => it.id === action.payload.id);
      if (!item) return;
      item.quantity = Math.max(1, Number(action.payload.quantity) || 1);
    },
    removeItemLocal: (state, action) => {
      state.products = state.products.filter((it) => it.id !== action.payload);
    },
    resetCart: (state) => {
      state.products = [];
    },
  },
});

export const { setCart, addLocal, updateQuantityLocal, removeItemLocal, resetCart } = cartSlice.actions;

// Thunks
export const fetchCart = (user) => async (dispatch) => {
  if (!user) return;
  try {
    const res = await ktsRequest.get(`/carts/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const products = res.data?.products || [];
    dispatch(setCart(products));
  } catch (err) {
    // swallow error for now
  }
};

export const addToCartServer = ({ productId, quantity = 1 }, user) => async (dispatch) => {
  if (!user) return;
  try {
    await ktsRequest.post(
      "/carts/add",
      { productId, quantity },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    // refresh cart
    dispatch(fetchCart(user));
  } catch (err) {
    // ignore
  }
};

export const removeFromCartServer = (productId, user) => async (dispatch) => {
  if (!user) return;
  try {
    await ktsRequest.delete("/carts/remove", {
      headers: { Authorization: `Bearer ${user.token}` },
      data: { productId },
    });
    dispatch(removeItemLocal(productId));
  } catch (err) {
    // ignore
  }
};

export const updateQuantityServer = (productId, quantity, user) => async (dispatch) => {
  if (!user) return;
  try {
    await ktsRequest.post(
      "/carts/update",
      { productId, quantity },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    dispatch(updateQuantityLocal({ id: productId, quantity }));
  } catch (err) {
    // ignore
  }
};

export const clearCartServer = (user) => async (dispatch) => {
  if (!user) return;
  try {
    await ktsRequest.post("/carts/clear", {}, { headers: { Authorization: `Bearer ${user.token}` } });
    dispatch(resetCart());
  } catch (err) {
    // ignore
  }
};

export default cartSlice.reducer;
