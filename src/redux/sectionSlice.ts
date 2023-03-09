import { createSlice } from "@reduxjs/toolkit";

export const SECTIONS = ["About", "Credentials", "Projects", "Opensource Contributions", "Links"];

export type Sections = {
	sections: Array<string>,
	selected: number,
}

export type SectionData = {
	type: string,
	payload: number
}

const initialState: Sections = {
    sections: SECTIONS,
    selected: 0
}

const sectionSlice = createSlice({
	name: "sections",
	initialState,
	reducers: {
		setSection(state, data: SectionData){
			state.selected = data.payload;
		}
	}
});

export const { setSection } = sectionSlice.actions;
export default sectionSlice.reducer;
