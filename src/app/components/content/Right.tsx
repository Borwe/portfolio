import { Box } from "@mui/material";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import "./Right.css";
import gsap from "gsap";

const right_img = "/imgs/look_left_up_black_border.png";
const right_black_red = "/imgs/look_left_up_red.png";
const right_black_green = "/imgs/look_left_up_green.png";

type ElementRef = MutableRefObject<HTMLImageElement>;
type Tween = gsap.core.Tween;

function setupGsapForRightLeftSplit(top: ElementRef,
	red: ElementRef, green: ElementRef, isHalf: boolean) {
	const rightPos = (isHalf ? 0 : window.innerWidth - top.current.clientWidth );
	console.log("RIGHT POS:", rightPos);
	return [
		gsap.fromTo(top.current, { right: 0 }, {
			bottom: "20%",
			duration: 4,
			repeat: -1,
			right: rightPos,
			yoyo: true
		}),
		gsap.fromTo(red.current, { right: 0 }, {
			bottom: "20%",
			repeat: -1,
			duration: 4,
			delay: 0.5,
			right: rightPos,
			yoyo: true
		}),
		gsap.fromTo(green.current, { right: 0, }, {
			bottom: "20%",
			repeat: -1,
			duration: 4,
			delay: 1,
			right: rightPos,
			yoyo: true
		})];
}

const Right: FC<{ isHalf: boolean }> = (props) => {
	const top = useRef(HTMLImageElement.prototype);
	const red = useRef(HTMLImageElement.prototype);
	const green = useRef(HTMLImageElement.prototype);

	const [anims, setAnims] = useState(new Array<Tween>());

	useEffect(() => {
		anims.forEach(anim => anim.kill());
		setAnims(setupGsapForRightLeftSplit(top, red, green, props.isHalf));
	}, [props.isHalf, window.innerWidth]);

	return <>
		<Box sx={{ width: "100%" }}>
			<img ref={top} id="right_img_top" src={right_img} alt="My image" />
			<img ref={red} id="right_img_red_mid"
				src={right_black_red} alt="My image" />
			<img ref={green} id="right_img_green"
				src={right_black_green} alt="My image" />
		</Box>
	</>
}

export default Right;
