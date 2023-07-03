import { Box } from "@mui/material";
import { FC, MutableRefObject, useEffect, useRef } from "react";
import "./Right.css";
import gsap from "gsap";
import { RightSideFlagSetters } from "../Content";
import { useAppSelector } from "../redux/hooks";
import { WindowState } from "../redux/windowSlice";

const black_top_img = "/imgs/look_left_up_black_border.png";
const red_top_img = "/imgs/look_left_up_red.png";
const green_top_img = "/imgs/look_left_up_green.png";

const graduate_img_black = "/imgs/graduate_black.png";
const graduate_img_green = "/imgs/graduate_green.png";
const graduate_img_red = "/imgs/graduate_red.png";

const book_img_black = "/imgs/book_black.png";
const book_img_red = "/imgs/book_red.png";
const book_img_green = "/imgs/book_green.png";

const run_img_black = "/imgs/run_black.png";
const run_img_red = "/imgs/run_red.png";
const run_img_green = "/imgs/run_green.png";


const mnt_img_black = "/imgs/mnt_black.png";
const mnt_img_red = "/imgs/mnt_red.png";
const mnt_img_green = "/imgs/mnt_green.png";

/// Store info on the image type passed
enum ImgType {
	Me, Graduate, Book, Run, Mnt
}

type ElementRef = MutableRefObject<HTMLImageElement>;

type ImageRef = {
	ref: ElementRef,
	imgType: ImgType
}

function yoyoUpDown(imgs: ElementRef[]) {
	for(let i=0; i<imgs.length; ++i){
		gsap.to(imgs[i].current,{
			bottom: "5%",
			duration: 3,
			repeat: -1,
			yoyo: true,
			delay: i*0.8
		});
	}
}

function blackPlaceLocationCenter(isHalf: boolean,
	width: number,
	img: ElementRef){
	if(isHalf){
		const halfWidth = width*0.4;
		const imgWidth = halfWidth - halfWidth * 0.2;
		img.current.style.width=imgWidth+"px";
		img.current.style.left = (halfWidth * 0.1)
			+(width*0.6) +"px";
		console.log("IMG WIDTH: ", imgWidth);
	}else{
	}
}

function white1PlaceLocationCenter(isHalf: boolean,
	windowState: WindowState, imgRef: ImageRef){
	if(isHalf){
			const halfWidth = windowState.width*0.4;
			const imgWidth = halfWidth - halfWidth * 0.2;
		switch(imgRef.imgType){
			case ImgType.Mnt:
				imgRef.ref.current.style.height =
					(windowState.height * 0.85)+"px";
				break;
			case ImgType.Book:
				imgRef.ref.current.style.height = (windowState.height * 0.85)+ 
					"px";
				imgRef.ref.current.style.left = (halfWidth * 0.1)+"px";
				break;
			case ImgType.Run:
				imgRef.ref.current.style.width=imgWidth+"px";
				imgRef.ref.current.style.left = (halfWidth * 0.1)+"px";
				break;
			default: 
				imgRef.ref.current.style.width=imgWidth+"px";
				imgRef.ref.current.style.height = (windowState.height * 0.85)+ 
					"px";
				imgRef.ref.current.style.left = (halfWidth * 0.1)+"px";
				console.log("IMG WIDTH: ", imgWidth);
				break;
		}
	}else{
	}
}

const RightFlag: FC<RightSideFlagSetters> = (props)=>{
	const windowState = useAppSelector(s => s.windows);

	const green = useRef(HTMLDivElement.prototype);
	const white1 = useRef(HTMLDivElement.prototype);
	const red = useRef(HTMLDivElement.prototype);
	const white2 = useRef(HTMLDivElement.prototype);

	const graduate_black = useRef(HTMLImageElement.prototype);
	const graduate_green = useRef(HTMLImageElement.prototype);
	const graduate_red = useRef(HTMLImageElement.prototype);

	const book_black = useRef(HTMLImageElement.prototype);
	const book_green = useRef(HTMLImageElement.prototype);
	const book_red = useRef(HTMLImageElement.prototype);

	const run_black = useRef(HTMLImageElement.prototype);
	const run_green = useRef(HTMLImageElement.prototype);
	const run_red = useRef(HTMLImageElement.prototype);

	const mnt_black = useRef(HTMLImageElement.prototype);
	const mnt_green = useRef(HTMLImageElement.prototype);
	const mnt_red = useRef(HTMLImageElement.prototype);


	useEffect(()=>{
		//setup the flags ref by updating the nill value
		props.white1[1](white1);
		props.red[1](red);
		props.white2[1](white2);
		props.green[1](green);
	}, [green, white1, white2, red, props.isHalf]);

	useEffect(()=>{
		[{ref: graduate_black, imgType: ImgType.Graduate},
			{ref: graduate_red, imgType: ImgType.Graduate},
			{ref: graduate_green, imgType: ImgType.Graduate},
			{ref: book_black, imgType: ImgType.Book},
			{ref: book_green, imgType: ImgType.Book},
			{ref: book_red, imgType: ImgType.Book},
			{ref: run_black, imgType: ImgType.Run},
			{ref: run_red, imgType: ImgType.Run},
			{ref: run_green, imgType: ImgType.Run},
			{ref: mnt_black, imgType: ImgType.Mnt},
			{ref: mnt_red, imgType: ImgType.Mnt},
			{ref: mnt_green, imgType: ImgType.Mnt},
		].forEach(x=> {
			white1PlaceLocationCenter(props.isHalf,windowState,x)
		})

		yoyoUpDown([graduate_black, graduate_red, graduate_green,
			book_black, book_green, book_red,
			run_black, run_green, run_red,
			mnt_black, mnt_green, mnt_red,
		])
	},[graduate_black, graduate_green, graduate_red,
		book_black, book_green, book_red,
		run_black, run_green, run_red,
		mnt_black, mnt_green, mnt_red,
	])

	return (
		<Box sx={{width: "100%",
				position: "fixed",
				height: (props.isHalf ? window.innerHeight :
				window.innerHeight * 0.25),
				zIndex: 95}}>
			<Box id="green_flag"  ref={green} >
				<img id="black_img" ref={mnt_green}
					src={mnt_img_green} alt="Grad flag" />
				<img id="black_img" ref={mnt_red}
					src={mnt_img_red} alt="Grad flag" />
				<img id="black_img" ref={mnt_black}
					src={mnt_img_black} alt="Grad flag" />
			</Box>
			<Box id="white2_flag" ref={white2} >
				<img id="black_img" ref={run_green}
					src={run_img_green} alt="Grad flag" />
				<img id="black_img" ref={run_red}
					src={run_img_red} alt="Grad flag" />
				<img id="black_img" ref={run_black}
					src={run_img_black} alt="Grad flag" />
			</Box>
			<Box id="red_flag" ref={red} >
				<img id="black_img" ref={book_green}
					src={book_img_green} alt="Grad flag" />
				<img id="black_img" ref={book_red}
					src={book_img_red} alt="Grad flag" />
				<img id="black_img" ref={book_black}
					src={book_img_black} alt="Grad flag" />
			</Box>
			<Box id="white1_flag" ref={white1} >
				<img id="black_img" ref={graduate_green}
					src={graduate_img_green} alt="Grad flag" />
				<img id="black_img" ref={graduate_red}
					src={graduate_img_red} alt="Grad flag" />
				<img id="black_img" ref={graduate_black}
					src={graduate_img_black} alt="Grad flag" />
			</Box>
		</Box>)
}

const Right: FC<RightSideFlagSetters> = (props) => {

	const width = useAppSelector(s=>s.windows.width)
	let black_right_img = useRef(HTMLImageElement.prototype);
	let red_right_img = useRef(HTMLImageElement.prototype);
	let green_right_img = useRef(HTMLImageElement.prototype);

	useEffect(()=>{
		yoyoUpDown([black_right_img, red_right_img, green_right_img]);
		[black_right_img, red_right_img, green_right_img].
			forEach(x=> blackPlaceLocationCenter(props.isHalf,width,x));
	},[black_right_img, red_right_img, green_right_img, width]);

	return <>
		<img id="black_top_img" ref={black_right_img}
			src={black_top_img} alt="My image" />
		<img id="red_top_img" ref={red_right_img}
			src={red_top_img} alt="My image" />
		<img id="green_top_img" ref={green_right_img}
			src={green_top_img} alt="My image" />

		<RightFlag isHalf={props.isHalf} green={props.green}
			white1={props.white1} red={props.red} 
			white2={props.white2}/>
	</>
}

export default Right;
