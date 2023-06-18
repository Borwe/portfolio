'use client'

import React from "react"
import { Provider } from "react-redux";
import App from './App';
import store from "./redux/store";
import "@fontsource/press-start-2p";

export function MainEntry() {
	return (
	<React.StrictMode>

		<Provider store={store}>
			<App />
		</Provider>

	</React.StrictMode>
	)
}
