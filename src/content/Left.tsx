import { Box } from "@mui/material"
import { FC, useEffect, useRef } from "react"
import About from "./About";
import Credentials from "./Credentials";
import Links from "./Links";
import OpenSource from "./OpenSource";
import Projects from "./Projects";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { RightSideDiv } from "../Content";

gsap.registerPlugin(ScrollTrigger);

const Left: FC<{rightSide: RightSideDiv}> = (props) => {
	let background = useRef(HTMLDivElement);
	let about = useRef(null);
	let credentials = useRef(null);
	let projects = useRef(null);
	let opensource = useRef(null);
	let links = useRef(null);

	useEffect(()=>{
		gsap.to(props.rightSide.current!,  {
			scrollTrigger: {
				trigger: about.current,
				onEnter: ()=> props.rightSide.current!.style.background="black",
				onEnterBack: ()=> props.rightSide.current!.style.background="black",
				scrub: true,
				pinSpacing: false,
			},
		})
		gsap.to(props.rightSide.current!,  {
			scrollTrigger: {
				trigger: credentials.current,
				onEnter: ()=> props.rightSide.current!.style.background="white",
				onEnterBack: ()=> props.rightSide.current!.style.background="white",
				scrub: true,
				pinSpacing: false,
			},
		})
		gsap.to(props.rightSide.current!,  {
			scrollTrigger: {
				trigger: projects.current,
				onEnter: ()=> props.rightSide.current!.style.background="red",
				onEnterBack: ()=> props.rightSide.current!.style.background="red",
				scrub: true,
				pinSpacing: false,
			},
		})
		gsap.to(props.rightSide.current!,  {
			scrollTrigger: {
				trigger: opensource.current,
				onEnter: ()=> props.rightSide.current!.style.background="white",
				onEnterBack: ()=> props.rightSide.current!.style.background="white",
				scrub: true,
				pinSpacing: false,
			},
		})
		gsap.to(props.rightSide.current!,  {
			scrollTrigger: {
				trigger: links.current,
				onEnter: ()=> props.rightSide.current!.style.background="green",
				onEnterBack: ()=> props.rightSide.current!.style.background="green",
				scrub: true,
				pinSpacing: false,
			},
		})
	}, [about, credentials, projects, opensource, links, background]);
	return (<Box ref={background}>
		<Box ref={about} sx={{marginBottom: "30px"}}><About /></Box>
		<Box ref={credentials} sx={{marginBottom: "30px"}} ><Credentials /></Box>
		<Box ref={projects} ><Projects /></Box>
		<Box ref={opensource} ><OpenSource /></Box>
		<Box ref={links} ><Links /></Box>
	</Box>)
}


export default Left;
