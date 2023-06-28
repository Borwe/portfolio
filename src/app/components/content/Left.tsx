'use client'
import { Box } from "@mui/material"
import { Dispatch, FC, MutableRefObject, useEffect, useReducer, useRef, useState } from "react"
import About from "./About";
import Credentials from "./Credentials";
import Links from "./Links";
import OpenSource from "./OpenSource";
import Projects from "./Projects";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { RightSideFlagsElements } from "../Content";


gsap.registerPlugin(ScrollTrigger);

export type BoxRef = MutableRefObject<HTMLDivElement>;
export type ReduceBoxRef = Dispatch<BoxRef>;

export const elementRefReducer =
	(_: BoxRef | undefined, action: BoxRef | undefined) => action



const Left: FC<RightSideFlagsElements> = (props) => {
	let [about, setAbout] = 
		useReducer(elementRefReducer,undefined);
	let [credentials, setCredentials] = 
		useReducer(elementRefReducer,undefined);
	let [projects, setProjects] =
		useReducer(elementRefReducer,undefined);
	let [opensource, setOpensorce] =
		useReducer(elementRefReducer,undefined);
	let [links, setLinks] = 
		useReducer(elementRefReducer,undefined);


	useEffect(()=>{
		let sectors = [about, credentials,
			projects, opensource, links];

		let flags = [ props.white1, props.red,
			props.white2, props.green]


		for(let i=0; i<sectors.length; ++i){
			if(sectors[i]==undefined){
				return;
			}
			
			gsap.to(sectors[i]!.current, {
				scrollTrigger: {
					trigger: sectors[i]!.current,
					start: props.isHalf? "bottom 90%"
						:"top "+(window.innerHeight*0.25)+"px",
					pin: true,
					pinSpacing: false,
				},
			})

		}

		for(let i=0; i<flags.length;++i){
			if(flags[i]==undefined){
				return;
			}

			console.log("FLAG:", i);

			gsap.to(flags[i].current!, {
				scrollTrigger: {
					trigger: sectors[i+1]!.current,
					start: "top "+(window.innerHeight-30)+"px",
					end: "top 60px",
					scrub: true,
					markers: true,
				},
				height: "100%"
			})
		}

	},[ props.isHalf, props.white2, props.white1,
		props.red, props.green, about,
		credentials, projects,opensource,links])

	return (<Box>
		<Box><About reduceRef={setAbout} /></Box>
		<Box><Credentials reduceRef={setCredentials}/></Box>
		<Box><Projects reduceRef={setProjects}/></Box>
		<Box><OpenSource reduceRef={setOpensorce}/></Box>
		<Box><Links reduceRef={setLinks} /></Box>
	</Box>)
}


export default Left;
