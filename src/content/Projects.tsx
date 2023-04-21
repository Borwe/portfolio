import { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";

const Projects: FC = () =>{
	const windowInfo = useAppSelector(state =>  state.windows);
	const mainDiv = useRef(HTMLDivElement.prototype);
	const [height, setHeight] = useState<number | undefined>(undefined);

	useEffect(()=>{

		if(windowInfo.height > mainDiv.current.clientHeight){
			setHeight(windowInfo.height );
			console.log("red:", windowInfo.height);
		}else{
			setHeight(mainDiv.current.scrollHeight);
			console.log("red normal!!!")
		}
	},[mainDiv, windowInfo, height]);

	return (<Box ref={mainDiv} sx={{
			backgroundColor: "red",
			marginBottom: "50px",
			height: height
		}}>
		<Typography variant="h2" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		Projects:
		</Typography>
		</Box>)
}

export default Projects;
