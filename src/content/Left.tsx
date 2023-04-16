import { Box } from "@mui/material"
import { FC } from "react"
import About from "./About";
import Credentials from "./Credentials";
import Links from "./Links";
import OpenSource from "./OpenSource";
import Projects from "./Projects";

const Left: FC = () => {
	return (<Box>
		<About />
		<Credentials />
		<Projects />
		<OpenSource />
		<Links/>
	</Box>)
}

export default Left;
