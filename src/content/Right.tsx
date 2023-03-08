import { Box } from "@mui/material";
import { FC, MouseEvent } from "react";
import "./Right.css";
import right_img from "../imgs/look_left_up_black_border.png";
import right_black_red from "../imgs/look_left_up_red.png";
import right_black_green from "../imgs/look_left_up_green.png";

type Position = {
	x: number,
	y: number
}

type ImagePositions = {
	black: Position,
	red: Position,
	green: Position
};

const Right: FC = () => {
	const rightHover = (event: MouseEvent) => {
		console.log("X:", event.screenX, "Y:", event.screenY);
	}
	return <Box id="right" onMouseMove={rightHover} >
		<Box id="right_img_top" >
			<img src={right_img} height="75%" alt="My image" />
		</Box>
		<Box id="right_img_red_mid">
			<img src={right_black_red} height="75%" alt="My image" />
		</Box>
		<Box id="right_img_green">
			<img src={right_black_green} height="75%" alt="My image" />
		</Box>
	</Box>
}

export default Right;
