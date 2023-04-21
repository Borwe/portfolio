import { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";

const Credentials: FC = () =>{
	const windowInfo = useAppSelector(state =>  state.windows);
	const mainDiv = useRef(HTMLDivElement.prototype);
	const [height, setHeight] = useState<number | undefined>(undefined);

	useEffect(()=>{

		if(windowInfo.height > mainDiv.current.clientHeight){
			setHeight(windowInfo.height );
			console.log("white:", windowInfo.height);
		}else{
			setHeight(mainDiv.current.scrollHeight);
			console.log("white normal!!!")
		}
	},[mainDiv, windowInfo, height]);

	return (<Box ref={mainDiv} sx={{
			backgroundColor: "white",
			marginBottom: "50px",
			height: height
		}}>
		<Typography variant="h2" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		Credentials:
		</Typography>
		</Box>)
}

export default Credentials;
