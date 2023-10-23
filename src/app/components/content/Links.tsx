import { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { ReduceBoxRef } from "./Left";
import TwitterIcon from "@mui/icons-material/Twitter";
import Github from "@mui/icons-material/Github";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import "./Links.css"

type Link = {
	image: typeof TwitterIcon ,
	link: string,
	description: string
}

const LINKS: Link[] = [
	{image: TwitterIcon,
		link: "https://twitter.com/BrianOrwe",
		description: "Twitter",
	},
	{image: Github,
		link: "https://github.com/borwe",
		description: "Github",
	},
	{ image: LinkedInIcon,
		description: "LinkedIn",
		link: "https://www.linkedin.com/in/brian-orwe-096b77127"
	}
];

const Link: FC<{link: Link}> = (props) =>{
	let image: HTMLOrSVGImageElement | HTMLImageElement;
	return <Box>
		<Typography variant="h5" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		<props.link.image/> - {props.link.description} 
		</Typography><br/>
	</Box>
}

const Links: FC<{ reduceRef : ReduceBoxRef }> = (props) =>{
	const windowInfo = useAppSelector(state =>  state.windows);
	const mainDiv = useRef(HTMLDivElement.prototype);

	useEffect(()=>{
		props.reduceRef(mainDiv);
		if(windowInfo.height > mainDiv.current.clientHeight){
			mainDiv.current.style.height=windowInfo.height+"px";
			console.log("white:", windowInfo.height);
		}
	},[mainDiv, windowInfo]);

	return (<div id="links_left" ref={mainDiv}>
		<Typography variant="h2" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		Links:
		</Typography><br/>
		{
			LINKS.map(l => <Link link={l} />)
		}
		</div>)
}

export default Links;
