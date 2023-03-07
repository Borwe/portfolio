import { configureStore } from "@reduxjs/toolkit";
import windowReducer from "./windowSlice";

const store = configureStore({
	reducer: {
		windows: windowReducer
	}
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
