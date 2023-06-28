'use client'
import { Box, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import { ReduceBoxRef } from "./Left";

gsap.registerPlugin(TextPlugin);

const ME: Array<string> = [
			"The brightest developer who hails from the East of Africa.",
			"The guy you want when you want to go from 0-100 real quick.",
			"A gamer, loves and plays soccer, both virtual and real.",
			"A Manchester United fun for life."
];

const About: FC<{reduceRef: ReduceBoxRef}> = (props)=> {
	const windowInfo = useAppSelector(state =>  state.windows);
	const mainDiv = useRef(HTMLDivElement.prototype);
	const textAbout = useRef(null);

	const [textShow, setTextToShow] = useState(0);

	useEffect(()=>{
		props.reduceRef(mainDiv);
		if(windowInfo.height > mainDiv.current.clientHeight){
			console.log("ABOUT BIG")
			mainDiv.current.style.height=windowInfo.height+"px";
		}

	},[mainDiv, windowInfo]);

	useEffect(()=>{
		// For animating text
		gsap.to(textAbout.current, {
			duration: 2,
			text: {
				value: ME[ textShow % ME.length],
			},
			ease: "power",
			onComplete: ()=>{
				let newTextShow = textShow+1;
				if( newTextShow > ME.length){
					newTextShow = 0;
				}
				setTimeout(()=>{
					setTextToShow(newTextShow);
				},2000);
			}
		});
	},[textAbout, textShow])

	return (<Box component="div" ref={mainDiv} sx={{
		backgroundColor: "black",
	}}>
		<Typography variant="h2" sx={{
			color: "white",
				fontFamily: '"Press Start 2P"'
		}}>
		Hi, I am Brian.
		</Typography>
		<Typography variant="h4" ref={textAbout}  sx={{
			marginTop: 8,
			marginBottom: "130px",
			color: "white",
				fontFamily: '"Press Start 2P"'
		}}>
		</Typography><br/>
		</Box>);
}

export default About;
