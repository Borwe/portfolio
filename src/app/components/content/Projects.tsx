import { FC, useEffect, useRef, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { ReduceBoxRef } from "./Left";
import "./Projects.css";

type Project = {
	title: string,
	info: string[],
	link: string[],
	languages: string[]
}

const PROJECTS: Project[] = [
	{
		title: "My portfolio",
		link: ["https://github.com/Borwe/portfolio"],
		info: ["You are looking at it 😀, a summary of my projects, and full list of opensource contributions to projects on github"],
		languages: ["Nextjs", "Typescript"]
	},
	{title: "KPLC Outage Parser",
		link: ["https://github.com/Borwe/kplc-outage-parser"],
		info: ["A library(crate) written in rust that get's outage information from data parsed from pdfs which is in a kind of tree structure format"],
		languages: ["Rust"]
	},
	{title: "KPLC Outage Server",
		link: ["https://github.com/Borwe/kplc-outage-server"],
		info: ["A server written in Rust that uses actix-web and my own crate \"KPLC Outage Parser\" for grabbing data from KPLC website about outages and producing it as simple json via a REST API to be consumed"],
		languages: ["Rust"]
	},
	{title: "Wakatime Proxy Server",
		link: ["https://github.com/Borwe/wakaflame-server"],
		info: ["A Proxy Server used get across CORS restrictions when trying to access wakatime REST api from front end using actix-web crate in Rust"],
		languages: ["Rust"]
	},
	{
		title: "WakaFlame",
		link: ["https://borwe.github.io/wakaflame","https://github.com/Borwe/wakaflame"],
		info: ["An Angular app using Material3 to display user information of top Kenyans currently ranking on wakatime.",
			"Apart from good intuitive UI, it also get's the latest data, which when using the official wakatime filtering options at wakatime.com which isn't as up to date.",
		"It also shows top languages by total user time and also total number of users of that language from top Kenyans"],
		languages: ["Typescript"]
	},
	{title: "Qt Creator wakatime plugin",
		link: ["https://github.com/Borwe/qtcreator-wakatime"],
		info: ["A C++ fork of an old wakatime QtCreator plugin updated to be fast, and a new style of handling events"],
		languages: ["C++", "CMake"]
	}
];


const CreateProject: FC<{proj: Project}> = (props)=>{
	return <Box>
		<Typography variant="h4" sx={{
			color: "black",
			fontFamily: '"Press Start 2P"'
		}}>
		{props.proj.title}:
		</Typography><br/>
		<Typography variant="h6" sx={{
			color: "black",
			fontFamily: '"Press Start 2P"'
		}}>
		<b><u>Link(s):</u></b>
		{
			props.proj.link.map((l,i)=>
				<span> <a href={l} target="_blank">{i+1}</a> </span>)
		}
		</Typography><br/>

		<Typography variant="h6" sx={{
			color: "black",
			fontFamily: '"Press Start 2P"'
		}}>
		<b><u>Stack:</u> </b>
		{
			props.proj.languages.map((l)=>
				<span> {l}</span>)
		}
		</Typography><br/>

		<Divider variant="middle" />

		{
			props.proj.info.map((inf)=> {
				return <Box>
					<Typography variant="h6" sx={{
						color: "black",
						fontFamily: '"Press Start 2P"'
					}}> {inf}
					</Typography>
					</Box>
			})
		}<br/>
		</Box>
}

const Projects: FC<{reduceRef: ReduceBoxRef}> = (props) =>{
	const windowInfo = useAppSelector(state =>  state.windows);
	const mainDiv = useRef(HTMLDivElement.prototype);

	useEffect(()=>{
		props.reduceRef(mainDiv)
		if(windowInfo.height > mainDiv.current.clientHeight){
			mainDiv.current.style.height=windowInfo.height+"px";
			console.log("red:", windowInfo.height);
		}
	},[mainDiv, windowInfo]);

	return (<div ref={mainDiv} id="projects_left">
		<Typography variant="h2" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		Projects:
		</Typography><br/>
		{
			PROJECTS.map(p=> <CreateProject proj={p} />)
		}
		<br/>
		</div>)
}

export default Projects;
