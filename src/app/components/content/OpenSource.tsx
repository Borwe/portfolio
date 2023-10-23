'use client'
import { FC, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { ReduceBoxRef } from "./Left";

const OpenSource: FC<{reduceRef: ReduceBoxRef}> = (props) =>{
	const windowInfo = useAppSelector(state =>  state.windows);
	const prs = useAppSelector(state => state.prs.prs);
	const mainDiv = useRef(HTMLDivElement.prototype);

	useEffect(()=>{
		props.reduceRef(mainDiv);
		if(windowInfo.height > mainDiv.current.clientHeight){
			mainDiv.current.style.height=windowInfo.height+"px";
			console.log("white:", windowInfo.height);
		}
	},[mainDiv, windowInfo]);

	return (<Box ref={mainDiv} sx={{
		backgroundColor: "white",
		marginBottom: "50px",
	}}>
		<Typography variant="h2" sx={{ fontFamily: '"Press Start 2P"' }} >
		OpenSource:
		</Typography>
		{
			prs.map(p=> <h1>{p.title}</h1>)
		}
		</Box>)
}

export default OpenSource;
