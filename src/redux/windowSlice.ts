import { createSlice } from "@reduxjs/toolkit"

export type WindowState = {
	width: number;
	height: number;
}

const initialState: WindowState = {
	width: 0,
	height: 0
};

const windowSlice = createSlice({
	name: "windows",
	initialState,
	reducers: {
		screenChanged(state){
			state.width = window.innerWidth;
			state.height = window.innerHeight;
		}
	}
});

export const { screenChanged } = windowSlice.actions;
export default windowSlice.reducer;
