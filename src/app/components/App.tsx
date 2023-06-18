'use client'

import { useEffect } from 'react';
import TopBar from './TopBar';
import Footer from './Footer';
import Content from './Content';
import { useAppDispatch} from "./redux/hooks";
import { screenChanged } from './redux/windowSlice';

function App() {
	const dispatch = useAppDispatch();
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
