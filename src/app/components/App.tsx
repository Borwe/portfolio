'use client'

import { FC, useEffect } from 'react';
import TopBar from './TopBar';
import Footer from './Footer';
import Content from './Content';
import { useAppDispatch} from "./redux/hooks";
import { screenChanged } from './redux/windowSlice';
import { PR } from '../page'
import { setup } from './redux/prsSlice';

const  App: FC<{prs: PR[]}> = (props) => {
	const dispatch = useAppDispatch();
	dispatch(setup(props.prs))
	dispatch(screenChanged());
	useEffect(() => {
		const windowSizeChange = () => {
			dispatch(screenChanged())
		};
		window.addEventListener("resize", windowSizeChange);
		return () => {
			window.removeEventListener("resize", windowSizeChange);
		}
	}, [dispatch]);

	return (<>
		<TopBar />
		<Content />
		<Footer />
	</>
	);
}

export default App;
