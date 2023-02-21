import React, { Dispatch, useEffect, useRef, useState, SetStateAction, FC } from 'react';
import "./TopBar.css";

const FLAG_GROWTH: number = 20;

type TextProp = {
  text: string
};

const TabListItem: FC<TextProp> = (prop: TextProp)=>{
  const span = prop.text.split("").map((c,i)=>{
    return <span key={i.toString()}>{c}</span>
  });
  return <li className="tab_list_item">{span}</li>;
}

function incrementFlagWidth(
  canvasblackPos: number, 
  setCanvasBlackPos: Dispatch<SetStateAction<number>>){
  setCanvasBlackPos(canvasblackPos+FLAG_GROWTH);
}

function handleAnimatingFlag(canvasLoaded: boolean,
  setCanvasLoaded: Dispatch<SetStateAction<boolean>>,
  canvasblackPos: number,
  setCanvasBlackPos: Dispatch<SetStateAction<number>>,
  canvas_ref: HTMLCanvasElement){
  let ctx = canvas_ref.getContext("2d")!;

  if(canvasblackPos + (FLAG_GROWTH) >= window.innerWidth - FLAG_GROWTH*7){
    //meaning current canvasblackPos is well outside the range expected.
    //then reset it to resonable level
    setCanvasBlackPos(window.innerWidth - FLAG_GROWTH*7);
  }

  //draw green pos
  ctx.fillStyle = "green";
  ctx.shadowBlur = 0;
  ctx.fillRect(0,0,canvasblackPos+(4*FLAG_GROWTH),canvas_ref.clientHeight);

  //draw white pos
  ctx.fillStyle = "white";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 50;
  ctx.fillRect(0,0,canvasblackPos+(3*FLAG_GROWTH),canvas_ref.clientHeight);

  //draw red pos
  ctx.fillStyle = "red";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 50;
  ctx.fillRect(0,0,canvasblackPos+(2*FLAG_GROWTH),canvas_ref.clientHeight);

  //draw white pos
  ctx.fillStyle = "white";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 50;
  ctx.fillRect(0,0,canvasblackPos+FLAG_GROWTH,canvas_ref.clientHeight);

  //draw black pos
  ctx.fillStyle = "black";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 50;
  ctx.fillRect(0,0,canvasblackPos,canvas_ref.clientHeight);

  if(canvasblackPos + (FLAG_GROWTH) <= window.innerWidth - FLAG_GROWTH*7){
    setTimeout(incrementFlagWidth,35,canvasblackPos,setCanvasBlackPos);
  }
}

const TopBar: React.FC = ()=>{
  let canvas_ref  = useRef(HTMLCanvasElement.prototype);
  let top_bar_ref = useRef(HTMLDivElement.prototype);
  //marking that we have comleted with the flag animation
  let [canvasLoaded, setCanvasLoaded] = useState(false);
  let [canvasblackPos, setCanvasBlackPos] = useState(10);
  let [windowWidth, setWindowWidth] = useState(0);

  //handle resizing width of canvas
  useEffect(()=>{
    const update_width = ()=>{
      setWindowWidth(window.innerWidth);
      //doesn't matter if, good actually to go off page
      canvas_ref.current.width = windowWidth+100;
      canvas_ref.current.height = top_bar_ref.current.clientHeight;
    }

    update_width();
    handleAnimatingFlag(canvasLoaded, setCanvasLoaded,
      canvasblackPos, setCanvasBlackPos,canvas_ref.current);

    window.addEventListener("resize",update_width);
    return ()=>{
      window.removeEventListener("resize",update_width);
    }
  },[windowWidth, canvasblackPos]);

  return (
    <>
    <canvas id="topbar_canvas" ref={canvas_ref}/>
    <div  id="topbar" ref={top_bar_ref}>

      <h2>
      <ul id="tab_list">
        <TabListItem  text="BOrwe"/>
        <TabListItem text="Projects"/>
        <TabListItem text="Opensource Contributions"/>
        <TabListItem text="About"/>
        <TabListItem text="Contact"/>
      </ul>
      </h2>
    </div>
    </>
  );
}

export default TopBar;
