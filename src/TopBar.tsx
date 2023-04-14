import React, { useEffect, useState, FC, Dispatch, SetStateAction, useRef } from 'react';
import { Toolbar, AppBar, Button, Typography, IconButton, Drawer } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from '@mui/system';
import "./TopBar.css";
import { useAppDispatch, UseAppDispatchType, useAppSelector } from './redux/hooks';
import { Sections, setSection } from './redux/sectionSlice';
import gsap from "gsap";


type UseDispatchFunc = ReturnType<typeof useAppDispatch>;

type MenuDrawerProps = {
	show: boolean,
	showMenuAction: Dispatch<SetStateAction<boolean>>,
	sections: Sections,
	dispatcher: UseDispatchFunc,
}

const MenuDrawer: FC<MenuDrawerProps> = (props: MenuDrawerProps) => {
	const handleCloseButton = () => {
		props.showMenuAction(false);
	}
	return (
		<Drawer anchor="left" open={props.show}
			PaperProps={{
				id: "drawer",
				sx: { backgroundColor: "green", width: "100%" }
			}}
			onClose={(event, reason) => { props.showMenuAction(false) }}>

			<Box sx={{ zIndex: 99, position: "absolute", right: 0, top: 0 }}>
				<IconButton sx={{
					color: "white", backgroundColor: "#222222",
					marginRight: "10px", marginTop: "10px"
				}} size="small"
					onClick={handleCloseButton}>
					<CloseRounded fontSize="large" />
				</IconButton>
			</Box>

			<Box sx={{
				zIndex: 100, width: "50%",
				marginRight: "2px", marginLeft: "auto",
				marginTop: 10
			}}>

				{
					props.sections.sections.map((p, i) => {
						const style: any = {
							textAlign: "right",
							color: 'white',
							display: 'block',
							width: "100%"
						};
						return <Button
							onClick={() => onClickMenuButton(props.dispatcher, i)}
							variant={i === props.sections.selected ? "contained" : "text"}
							color="error" key={i.toString()} sx={style}>
							<Typography variant="subtitle1" sx={{ zIndex: 99 }}
								display="block" m={1} >{p}</Typography>
						</Button>
					})
				}
			</Box>
			<Box id="black_drawer" />
			<Box id="white1_drawer" />
			<Box id="red_drawer" />
			<Box id="white2_drawer" />
		</Drawer>
	);
}

const FlagBackground: FC<{
	setStartShowingTopButtons: Dispatch<SetStateAction<boolean>>
}> = (props) => {
	const black = useRef(null);
	const white1 = useRef(null);
	const red = useRef(null);
	const white2 = useRef(null);

	//setup flag animations on topbar
	useEffect(() => {
		let timeline = gsap.timeline({ delay: -1 });
		timeline.to(white2.current, {
			width: "90%",
			ease: "power4",
			duration: 1,
		})

		timeline.to(red.current, {
			width: "88.5%",
			ease: "power4",
			duration: 1,
		})

		timeline.to(white1.current, {
			width: "80%",
			ease: "power4",
			duration: 1,
		})

		timeline.to(black.current, {
			width: "78.5%",
			ease: "power4",
			duration: 1,
			onStart: () => props.setStartShowingTopButtons(true)
		})
	}, [black, white1, red, white2]);

	return <Box width={"100%"} height={"100%"} sx={{
		position: "absolute",
		display: "box",
		top: "0px",
		left: "0px",
	}}>
		<Box id="black" ref={black} />
		<Box id="white1" ref={white1} />
		<Box id="red" ref={red} />
		<Box id="white2" ref={white2} />
	</Box>
}


const onClickMenuButton = (dispatcher: UseDispatchFunc, pos: number) => {
	dispatcher(setSection(pos));
}

const MenuToDisplay: FC<{
	startShowingTopButtons: boolean,
	showExpandMenu: boolean,
	setShowMenuDrawer: Dispatch<SetStateAction<boolean>>
	sections: Sections,
	dispatcher: UseAppDispatchType
}> = (props) => {
	const divRef = useRef<HTMLDivElement>(null);
	const [opacity, setOpacity] = useState(0);

	useEffect(() => {
		if (props.startShowingTopButtons) {
			gsap.to(divRef.current, {
				opacity: 1,
				duration: 1,
				onUpdate: () => {
					if (divRef.current !== undefined) {
						try {
							setOpacity(+divRef.current!.style.opacity);
						} catch (e) { }
					}
				}
			})
		}
	}, [divRef, props.startShowingTopButtons]);

	if (props.showExpandMenu === false) {
		return <Box ref={divRef}>
			<IconButton
				sx={{ opacity: opacity }}
				 onClick={() => props.setShowMenuDrawer(true)}>
				<MenuIcon sx={{ color: 'white', zIngex: 99 }} />
			</IconButton>
		</Box>
	} else {
		const buttons = props.sections.sections.map((p, i) => {
			return <Button key={i.toString()}
				onClick={() => onClickMenuButton(props.dispatcher, i)}
				variant={i === props.sections.selected ? "contained" : "text"}
				color="error"
				sx={{
					color: 'white',
					display: 'inline',
				}}>
				<Typography variant="button" sx={{ zIngex: 99 }}
					display="block" mr={1} ml={1}>{p}</Typography>
			</Button>
		});
		return (<Box ref={divRef} sx={{ opacity: opacity }}>{buttons}</Box>)
	}
}

const TopBar: React.FC = () => {
	const windowInfo = useAppSelector(state => state.windows);
	const sections = useAppSelector(state => state.sections);
	const dispatcher = useAppDispatch();

	const [showExpandMenu, setShowExpandMenu] = useState(true);
	const [showMenuDrawer, setShowMenuDrawer] = useState(false);

	//used for showing the top bar button at the top in animation
	const [startShowingTopButtons, setStartShowingTopButtons] = useState(false);

	useEffect(() => {
		if (windowInfo.width < 880) {
			setShowExpandMenu(false);
		} else {
			setShowExpandMenu(true);
		}
	});

	return (
		<>
			<AppBar sx={{ position: "sticky", top: 0, left: 0 }}>
				<Toolbar sx={{ backgroundColor: "green" }}>
					<FlagBackground
						setStartShowingTopButtons={setStartShowingTopButtons} />
					<Box sx={{ zIndex: 99 }}>
						<MenuToDisplay showExpandMenu={showExpandMenu}
							startShowingTopButtons={startShowingTopButtons}
							setShowMenuDrawer={setShowMenuDrawer} sections={sections}
							dispatcher={dispatcher}
						/>
					</Box>
				</Toolbar>
				<MenuDrawer
					sections={sections} dispatcher={dispatcher}
					show={showMenuDrawer} showMenuAction={setShowMenuDrawer}
				/>
			</AppBar>
		</>
	);
}

export default TopBar;
