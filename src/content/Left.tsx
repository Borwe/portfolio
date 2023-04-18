import { Box } from "@mui/material"
import { FC, useEffect, useRef } from "react"
import About from "./About";
import Credentials from "./Credentials";
import Links from "./Links";
import OpenSource from "./OpenSource";
import Projects from "./Projects";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Left: FC = () => {
	let background = useRef(HTMLDivElement);
	let about = useRef(null);
	let credentials = useRef(null);
	let projects = useRef(null);
	let opensource = useRef(null);
	let links = useRef(null);

	useEffect(()=>{
		gsap.to(background.current,  {
			scrollTrigger: {
				trigger: about.current,
				start: "bottom 50%",
				scrub: 1,
				pin: true,
				pinSpacing: false,
			},
		})
		gsap.to(background.current,  {
			scrollTrigger: {
				trigger: credentials.current,
				start: "bottom 50%",
				scrub: 1,
				pin: true,
				pinSpacing: false,
			},
		})
		gsap.to(background.current,  {
			scrollTrigger: {
				trigger: projects.current,
				start: "bottom 50%",
				scrub: 1,
				pin: true,
				pinSpacing: false,
			},
		})
		gsap.to(background.current,  {
			scrollTrigger: {
				trigger: opensource.current,
				start: "bottom 50%",
				scrub: 1,
				pin: true,
				pinSpacing: false,
			},
		})
		gsap.to(background.current,  {
			scrollTrigger: {
				trigger: links.current,
				start: "bottom 50%",
				scrub: 1,
				pin: true,
				pinSpacing: false,
			},
		})
		//ScrollTrigger.create({
		//	trigger: projects.current,
		//	start: "bottom 70%",
		//	pin: true,
		//	pinSpacing: false
		//});
		//ScrollTrigger.create({
		//	trigger: opensource.current,
		//	start: "bottom 70%",
		//	pin: true,
		//	pinSpacing: false
		//});
		//ScrollTrigger.create({
		//	trigger: links.current,
		//	start: "bottom 70%",
		//	pin: true,
		//	pinSpacing: false
		//});
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
