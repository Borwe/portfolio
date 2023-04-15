import { Box } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import "./Right.css";
import right_img from "../imgs/look_left_up_black_border.png";
import right_black_red from "../imgs/look_left_up_red.png";
import right_black_green from "../imgs/look_left_up_green.png";
import gsap from "gsap";

const Right: FC = () => {
	const top = useRef(null);
	const red = useRef(null);
	const green = useRef(null);

	useEffect(()=>{
		gsap.to(top.current, {
			bottom: "5%",
			duration: 1,
			repeat: -1,
			yoyo: true
		})
		gsap.to(red.current, {
			bottom: "5%",
			repeat: -1,
			duration: 1,
			delay: 0.1,
			yoyo: true
		});
		gsap.to(green.current, {
			bottom: "5%",
			repeat: -1,
			duration: 1,
			delay: 0.2,
			yoyo: true
		});
	}, [top,green, red]);

	return <Box id="right" >
		<Box ref={top} id="right_img_top" >
			<img src={right_img} height="75%" alt="My image" />
		</Box>
		<Box ref={red} id="right_img_red_mid">
			<img src={right_black_red} height="75%" alt="My image" />
		</Box>
		<Box ref={green} id="right_img_green">
			<img src={right_black_green} height="75%" alt="My image" />
		</Box>
	</Box>
}

export default Right;
