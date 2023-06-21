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

	return (<Box ref={background}>
		<Box ref={about} ><About /></Box>
		<Box ref={credentials} ><Credentials /></Box>
		<Box ref={projects} ><Projects /></Box>
		<Box ref={opensource} ><OpenSource /></Box>
		<Box ref={links} ><Links /></Box>
	</Box>)
}


export default Left;
