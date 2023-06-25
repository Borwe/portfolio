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

const RightFlag: FC<{isHalf: boolean}> = (props)=>{
	console.log("HALF: ",props.isHalf)
	const black = useRef(HTMLDivElement.prototype);
	const white1 = useRef(HTMLDivElement.prototype);
	const red = useRef(HTMLDivElement.prototype);
	const white2 = useRef(HTMLDivElement.prototype);


	// TODO animate flags to down 
	useEffect(()=>{
		gsap.to(black.current,{
			height: (props.isHalf ? window.innerHeight :
				window.innerHeight * 0.25),
			duration: 1,
			delay: 5
		})
		gsap.to(white1.current,{
			height: (props.isHalf ? window.innerHeight :
				window.innerHeight * 0.25),
			duration: 1,
			delay: 4
		})
		//gsap.to(red.current,{
		//	height: (props.isHalf ? window.innerHeight - 30 :
		//		window.innerHeight * 0.25+"px"),
		//	duration: 1,
		//	delay: 3
		//})
		//gsap.to(white2.current,{
		//	height: (props.isHalf ? window.innerHeight - 30 :
		//		window.innerHeight * 0.25+"px"),
		//	duration: 1,
		//	delay: 2
		//})
	}, [black, white1, red, white2, props.isHalf]);
	// TODO Handle opening the divs like a card scrolling 
	// according to section

	return (
		<Box sx={{width: "100%",
				position: "fixed",
				height: (props.isHalf ? window.innerHeight :
				window.innerHeight * 0.25),
				zIndex: 95}}>
			<Box id="black_flag"  ref={black} />
			<Box id="white1_flag" ref={white1} />
			<Box sx={{zIndex: 104,
					backgroundColor: "red",
					top: "0px"
			}} ref={red} />
			<Box sx={{zIndex: 102,
					backgroundColor: "white",
					top: "0px"
			}} ref={white2} />
		</Box>)
}

const Right: FC<{ isHalf: boolean }> = (props) => {
	const top = useRef(HTMLImageElement.prototype);
	const red = useRef(HTMLImageElement.prototype);
	const green = useRef(HTMLImageElement.prototype);

	const [anims, setAnims] = useState(new Array<Tween>());

	useEffect(() => {
		anims.forEach(anim => anim.kill());
		setAnims(setupGsapForRightLeftSplit(top, red, green));
	}, [props.isHalf, window.innerWidth]);

	return <>
		<RightFlag isHalf={props.isHalf}/>
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
