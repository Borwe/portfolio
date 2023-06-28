import { Box } from "@mui/material";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import "./Right.css";
import gsap from "gsap";
import { RightSideFlagSetters } from "../Content";

const right_img = "/imgs/look_left_up_black_border.png";
const right_black_red = "/imgs/look_left_up_red.png";
const right_black_green = "/imgs/look_left_up_green.png";

type ElementRef = MutableRefObject<HTMLImageElement>;
type Tween = gsap.core.Tween;

function setupGsapForRightLeftSplit(top: ElementRef,
	red: ElementRef, green: ElementRef) {
	return [
		gsap.fromTo(top.current, { right: 0 }, {
			bottom: "20%",
			duration: 4,
			repeat: -1,
			yoyo: true
		}),
		gsap.fromTo(red.current, { right: 0 }, {
			bottom: "20%",
			repeat: -1,
			duration: 4,
			delay: 0.5,
			yoyo: true
		}),
		gsap.fromTo(green.current, { right: 0, }, {
			bottom: "20%",
			repeat: -1,
			duration: 4,
			delay: 1,
			yoyo: true
		})];
}

const RightFlag: FC<RightSideFlagSetters> = (props)=>{
	console.log("HALF: ",props.isHalf)

	const green = useRef(HTMLDivElement.prototype);
	const white1 = useRef(HTMLDivElement.prototype);
	const red = useRef(HTMLDivElement.prototype);
	const white2 = useRef(HTMLDivElement.prototype);

	useEffect(()=>{
		//setup the flags ref by updating the nill value
		props.white1[1](white1);
		props.red[1](red);
		props.white2[1](white2);
		props.green[1](green);
	}, [green, white1, white2, red, props.isHalf]);

	// TODO Handle opening the divs like a card scrolling 
	// according to section

	return (
		<Box sx={{width: "100%",
				position: "fixed",
				height: (props.isHalf ? window.innerHeight :
				window.innerHeight * 0.25),
				zIndex: 95}}>
			<Box id="green_flag"  ref={green} />
			<Box id="white2_flag" ref={white2} />
			<Box id="red_flag" ref={red} />
			<Box id="white1_flag" ref={white1} />
		</Box>)
}

const Right: FC<RightSideFlagSetters> = (props) => {
	const top = useRef(HTMLImageElement.prototype);
	const red = useRef(HTMLImageElement.prototype);
	const green = useRef(HTMLImageElement.prototype);

	const [anims, setAnims] = useState(new Array<Tween>());

	useEffect(() => {
		anims.forEach(anim => anim.kill());
		setAnims(setupGsapForRightLeftSplit(top, red, green));
	}, [props.isHalf, window.innerWidth]);

	return <>
		<RightFlag isHalf={props.isHalf} green={props.green}
			white1={props.white1} red={props.red} 
			white2={props.white2}/>
		<Box sx={{ width: "100%", zIndex: 111 }}>
			<img ref={top} id="right_img_top" src={right_img} alt="My image" />
			<img ref={red} id="right_img_red_mid"
				src={right_black_red} alt="My image" />
			<img ref={green} id="right_img_green"
				src={right_black_green} alt="My image" />
		</Box>
	</>
}

export default Right;
