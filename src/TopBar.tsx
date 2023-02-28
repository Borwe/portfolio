import React, { useEffect, useState, FC, MouseEventHandler, Dispatch, SetStateAction } from 'react';
import {Toolbar, AppBar, Button, Typography, IconButton, Drawer} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from '@mui/system';
import "./TopBar.css";

const pages = ["About","Credentials","Projects","Opensource Contributions","Links"];


type MenuDrawerProps = {
  show: boolean,
  showMenuAction: Dispatch<SetStateAction<boolean>>
}

const MenuDrawer: FC<MenuDrawerProps> = (props: MenuDrawerProps)=>{
  const handleCloseButton = ()=>{
    props.showMenuAction(false);
  }
  return (
    <Drawer anchor="left" open={props.show}
    PaperProps={{
      id: "drawer",
	sx: {backgroundColor: "green", width: "100%" }
    }}
    onClose={(event, reason)=>{ props.showMenuAction(false)}}>

    <Box sx={{zIndex: 99, position: "absolute", right: 0, top: 0}}>
    <IconButton sx={{color: "white"}} size="large"
    onClick={handleCloseButton}>
    <CloseRounded fontSize="large"/>
    </IconButton>
    </Box>

    <Box sx={{zIndex: 100, width: "50%", 
	marginRight: "2px", marginLeft: "auto",
	marginTop: 10}}>


    {
      pages.map((p, i)=>{
	return <Button variant="text" key={i.toString()}
	sx={{
	  textAlign: "right",
	    color: 'white',
	    display: 'block',
	    width: "100%"
	}}>
	  <Typography variant="subtitle1" sx={{zIndex: 99}}
	display="block" m={1} >{p}</Typography>
	  </Button>
      })
    }
    </Box>
    <Box id="black_drawer"/>
    <Box id="white1_drawer"/>
    <Box id="red_drawer"/>
    <Box id="white2_drawer"/>
    </Drawer>
  );
}

const FlagBackground: FC = ()=>{
  return <Box width={"100%"} height={"100%"} sx={{
    position: "absolute",
      display: "box",
      top: "0px",
      left: "0px",
  }}>
    <Box id="black"></Box>
    <Box id="white1"></Box>
    <Box id="red"></Box>
    <Box id="white2"></Box>
    </Box>
}

const TopBar: React.FC = ()=>{
  let [showExpandMenu, setShowExpandMenu] = useState(true);
  let [showMenuDrawer, setShowMenuDrawer] = useState(false);

  useEffect(()=>{
    const windowChangeListener = (event: UIEvent )=>{
      if(window.innerWidth<880){
	setShowExpandMenu(false);
      }else{
	setShowExpandMenu(true);
      }
    }
    if(window.innerWidth<880){
      setShowExpandMenu(false);
    }
    window.addEventListener("resize", windowChangeListener );
    return ()=>{
      window.removeEventListener("resize",windowChangeListener);
    }
  },[showExpandMenu]);

  const userClickMenuIcon: MouseEventHandler<HTMLButtonElement> =
    (event: any)=>{
      setShowMenuDrawer(true);
    }

  const MenuToDisplay = ()=>{
    if(showExpandMenu==false){
      return <IconButton onClick={userClickMenuIcon}>
	<MenuIcon sx={{color: 'white', zIngex: 99}} />
	</IconButton>
    }else{

      return pages.map((p, i)=>{
	return <Button key={i.toString()}
	sx={{
	  color: 'white',
	    display: 'inline',
	}}>
	  <Typography variant="button" sx={{zIngex: 99}}
	display="block" mr={1} ml={1}>{p}</Typography>
	  </Button>
      });
    }
  }

  return (
    <>
    <AppBar sx={{position: "sticky", top: 0, left:0}}>
    <Toolbar sx={{backgroundColor: "green"}}>
    <FlagBackground />
    <Box sx={{zIndex: 99}}>
    {MenuToDisplay()}
    </Box>
    </Toolbar>
    <MenuDrawer  show={showMenuDrawer} showMenuAction={setShowMenuDrawer}/>
    </AppBar>
    </>
  );
}

export default TopBar;
