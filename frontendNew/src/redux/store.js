import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartReducer";
import msgReducer from "./msgSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		cart: cartReducer,
		msg: msgReducer,
	},
});
