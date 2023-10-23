import { PR } from "@/app/page";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PrsState = {
	loaded: boolean
	prs: PR[]
}

const initialState: PrsState = {
	loaded: false,
	prs: []
}

const prsSlice = createSlice({
	name: 'prs',
	initialState,
	reducers: {
		setup(state, action: PayloadAction<Array<PR>>){
			state.loaded = true
			state.prs = action.payload
		}
	}
});

export const {setup} = prsSlice.actions;
export default prsSlice.reducer;
