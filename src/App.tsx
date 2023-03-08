import React, { useEffect } from 'react';
import TopBar from './TopBar';
import Footer from './Footer';
import Content from './Content';
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import { screenChanged } from './redux/windowSlice';

function App() {
	const dispatch = useAppDispatch();
	useEffect(()=>{
		window.addEventListener("resize",(event: UIEvent)=>{
			dispatch(screenChanged());
		});
	},[dispatch]);
  return (<>
    <TopBar/>
    <Content/>
    <Footer/>
	  </>
  );
}

export default App;
