import { configureStore } from "@reduxjs/toolkit";
import windowReducer from "./windowSlice";
import sectionReducer from "./sectionSlice";
import prsSlice from "./prsSlice";

const store = configureStore({
	reducer: {
		windows: windowReducer,
		sections: sectionReducer,
		prs: prsSlice
	}
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
