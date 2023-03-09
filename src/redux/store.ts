import { configureStore } from "@reduxjs/toolkit";
import windowReducer from "./windowSlice";
import sectionReducer from "./sectionSlice";

const store = configureStore({
	reducer: {
		windows: windowReducer,
		sections: sectionReducer
	}
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
