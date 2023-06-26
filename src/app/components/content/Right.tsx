import { Box } from "@mui/material";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import "./Right.css";
import gsap from "gsap";
import { RightSideFlagSection, RightSideFlagsElements } from "../Content";

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

const RightFlag: FC<RightSideFlagsElements> = (props)=>{
	console.log("HALF: ",props.isHalf)

	// TODO animate flags to down 
	useEffect(()=>{
		gsap.to(props.black.current!,{
			height: "100%",
			duration: 1,
			delay: 4
		})
		gsap.to(props.white1.current!,{
			height: "100%",
			duration: 1,
			delay: 3
		})
		gsap.to(props.red.current!,{
			height: "100%",
			duration: 1,
			delay: 2
		})
		gsap.to(props.white2.current!,{
			height: "100%",
			duration: 1,
			delay: 1
		})
	}, [props.black, props.white1, props.red, props.white2,
		props.isHalf]);
	// TODO Handle opening the divs like a card scrolling 
	// according to section

	return (
		<Box sx={{width: "100%",
				position: "fixed",
				height: (props.isHalf ? window.innerHeight :
				window.innerHeight * 0.25),
				zIndex: 95}}>
			<Box id="black_flag"  ref={props.black} />
			<Box id="white1_flag" ref={props.white1} />
			<Box id="red_flag" ref={props.red} />
			<Box id="white2_flag" ref={props.white2} />
		</Box>)
}

const Right: FC<RightSideFlagsElements> = (props) => {
	const top = useRef(HTMLImageElement.prototype);
	const red = useRef(HTMLImageElement.prototype);
	const green = useRef(HTMLImageElement.prototype);

	const [anims, setAnims] = useState(new Array<Tween>());

	useEffect(() => {
		anims.forEach(anim => anim.kill());
		setAnims(setupGsapForRightLeftSplit(top, red, green));
	}, [props.isHalf, window.innerWidth]);

	return <>
		<RightFlag isHalf={props.isHalf} black={props.black}
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
