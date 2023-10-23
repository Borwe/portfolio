'use client'

import React, { FC } from "react"
import { Provider } from "react-redux";
import App from './App';
import store from "./redux/store";
import "@fontsource/press-start-2p";
import { PR } from "../page";

export const MainEntry: FC<{prs: PR[]}> = (props)=>{
	return (
	<React.StrictMode>

		<Provider store={store}>
			<App prs={props.prs}/>
		</Provider>

	</React.StrictMode>
	)
}
