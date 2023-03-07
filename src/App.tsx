import React, { useEffect } from 'react';
import TopBar from './TopBar';
import Footer from './Footer';
import Content from './Content';
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import { screenChanged } from './redux/windowSlice';

function App() {
	const windowInfo = useAppSelector((state)=> state.windows);
	const dispatch = useAppDispatch();
	useEffect(()=>{
		window.addEventListener("resize",(event: UIEvent)=>{
			dispatch(screenChanged());
		});
	},[windowInfo, dispatch]);
  return (<>
    <TopBar/>
    <Content/>
    <Footer/>
	  </>
  );
}

export default App;
