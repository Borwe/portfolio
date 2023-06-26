'use client'

import { FC, useEffect, useRef, useState } from "react";
import Right from "./content/Right";
import Left from "./content/Left";
import { Box } from "@mui/material";
import { useAppSelector } from "./redux/hooks";
import { SxProps } from "@mui/system";

export type RightSideFlagSection = 
  ReturnType<typeof useRef<HTMLDivElement>>;

export type RightSideFlagsElements = {
	isHalf: boolean,
	black: RightSideFlagSection,
	white1: RightSideFlagSection,
	red: RightSideFlagSection,
	white2: RightSideFlagSection,
}

enum Side {
  Left, Right, Top, Bottom
};


function createLocationSx(side: Side): SxProps {
  // If screen greater than 1000px wide use this
  if (side === Side.Left || side === Side.Right) {
    let result: SxProps = {
      top: 50,
      zIndex: 99,
    };

    if (side === Side.Left) {
      result.width = "60%"
      result.marginBottom = "30px";
      result.left = 0;
      result.wordWrap = "break-word";
    } else if (side === Side.Right) {
      result.width = "40%"
      result.backgroundColor = "green";
      result.height = "100%";
      result.position = "fixed";
      result.right = 0;
    }

    return result;
  } else {
    if (side === Side.Top) {
      return {
        top: 55,
        backgroundColor: "black",
        position: "fixed",
        height: "25%",
        width: "100%",
        zIndex: 99
      }
    } else {
      //meaning we are in bottom, creating it's css
      console.log("WINDOW_POS:",(window.innerHeight*0.25)+50);
      return {
        zIndex: 90,
        wordWrap: "break-word",
        width: window.innerWidth,
        marginTop: (window.innerHeight*0.245)+"px",
        marginBottom: "30px"
      }
    }
  }
}

const Content: FC = () => {
  const windowInfo = useAppSelector(state => state.windows);
  let rightSx = createLocationSx(Side.Right);
  let leftSx  = createLocationSx(Side.Left);
  // state if width is half or not
  const [isHalf, setIsHalf] = useState(true);

	const black = useRef(HTMLDivElement.prototype);
	const white1 = useRef(HTMLDivElement.prototype);
	const red = useRef(HTMLDivElement.prototype);
	const white2 = useRef(HTMLDivElement.prototype);

  //Render with different CSS depending on window size
  if (!isHalf) {
    rightSx = createLocationSx(Side.Top);
    leftSx = createLocationSx(Side.Bottom);
  }

  useEffect(() => {
    if(windowInfo.width < 750){
      setIsHalf(false)
    }else{
      setIsHalf(true);
    }
  }, [windowInfo]);

  return (<>
    <Box sx={rightSx} >
      <Right isHalf={isHalf} black={black} white1={white1}
        red={red} white2={white2}/>
    </Box>
    <Box sx={leftSx} ><Left 
        isHalf={isHalf} black={black} white1={white1}
        red={red} white2={white2}
    /></Box>
  </>
  );
}

export default Content;
