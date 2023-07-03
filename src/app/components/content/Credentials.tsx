import { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { ReduceBoxRef } from "./Left";

type Range = {
	start: string | null,
	end: string 
}

type Credential = {
	range: Range,
	info: string,
}

const CREDENTIALS: Credential[] = [
	{range: {start: "OCT 2013", end: "OCT 2017"}, 
		info: "Barchelors Degree Business Information Technology from Kenya Methodist University (Main Campus)"},
	{range: {start: null, end: "2022"},
		info: "NEAR Blockchain certified developer"},
	{range: {start: null, end: "APR 2017"},
		info: "Cisco Certified Network Associate course, from Institute of Advance Technology (Mombasa)"},
	{range: {start: null, end: "2018"},
		info: "Google Android Associate Developer"},
	{range: {start: "2018", end: "2019"},
		info: "KASNEB CPA 1,2,3"}
];

const CreateCredential: FC<{cred: Credential}> = (props)=>{
	const range = props.cred.range.start == null?
		"On "+props.cred.range.end: "From "
		+props.cred.range.start+" -> "+props.cred.range.end;

	return <Box>
		<Typography variant="h4" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		{range}
		</Typography><br/>
		<Typography variant="h5" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		{props.cred.info}
		</Typography><br/>
	</Box>
}

const Credentials: FC<{reduceRef: ReduceBoxRef}> = (props) =>{
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
			backgroundColor: "white",
			marginBottom: "150px",
		}}>
		<Typography variant="h2" sx={{
			fontFamily: '"Press Start 2P"'
		}}>
		Credentials:
		</Typography>
		{
			CREDENTIALS.map(credential =>{
				return <CreateCredential cred={credential} />
			})
		}
		</Box>)
}

export default Credentials;
