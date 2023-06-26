import { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { ReduceBoxRef } from "./Left";

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

	return (<Box ref={mainDiv} sx={{
			backgroundColor: "green",
		}}>
		<Typography variant="h2" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		Links:
		</Typography>
		</Box>)
}

export default Links;
