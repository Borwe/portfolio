'use client'
import { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { ReduceBoxRef } from "./Left";

const OPENSOURCE_LINK = 
	"https://portfolio-brian.fly.dev/opensource";

type PR = {
	title: string,
	img: string,
	updated_at: string,
	org_icon: string
}

const sleep = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

async function getOpensourcePRs(): Promise<PR[]>{
	let success = false;
	let wait = 0; //holds the seconds to wait before retry
	console.log("Starting getting contribs");
	while(success==false){
		await sleep(wait);

		try{
			const resp = await fetch(OPENSOURCE_LINK)
			if(resp.status == 200){
				success = true;
			}else{
				wait+=1000; //increment await by 1 second
				continue;
			}

			return JSON.parse(""+resp.body)
		}catch(_){
			wait+=1000;
			continue; //increment await by 1 second
		}
	}

	return []
}

const OpenSource: FC<{reduceRef: ReduceBoxRef}> = (props) =>{
	const windowInfo = useAppSelector(state =>  state.windows);
	const mainDiv = useRef(HTMLDivElement.prototype);

	const [prs, setPRs] = useState(Array<PR>);

	useEffect(()=>{
		props.reduceRef(mainDiv);
		if(windowInfo.height > mainDiv.current.clientHeight){
			mainDiv.current.style.height=windowInfo.height+"px";
			console.log("white:", windowInfo.height);
		}
	},[mainDiv, windowInfo]);

	useEffect(()=>{
		getOpensourcePRs().then(prs=> console.log("PRS:", prs))
	},[])

	return (<Box ref={mainDiv} sx={{
		backgroundColor: "white",
		marginBottom: "50px",
	}}>
		<Typography variant="h2" sx={{ fontFamily: '"Press Start 2P"' }} >
		OpenSource:
		</Typography>
		</Box>)
}

export default OpenSource;
