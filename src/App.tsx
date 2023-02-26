import { randomBytes } from 'crypto';
import React from 'react';
import TopBar from './TopBar';
import Footer from './Footer';
import Content from './Content';

function App() {
  const WOOTS = [100].map((x)=><h2>HOOT</h2>);
  return (<>
    <TopBar/>
    <Content/>
    <Footer/>
	  </>
  );
}

export default App;
