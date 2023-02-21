import React from 'react';
import "./TopBar.css";

const animate_topbar_flag: React.EffectCallback = 
  ()=>{
    let canvas = document.getElementById("topbar_canvas")! as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    if(ctx==undefined){
      alert("Browser doesn't support Canvas API");
      return;
    }
    const topbar = document.getElementById("topbar")!;
    handle_sizing_topbar_canvas();

    //draw black flag
    ctx.fillStyle = "rgba(0,0,0,0)";
}


const handle_sizing_topbar_canvas = ()=>{
    let canvas = document.getElementById("topbar_canvas")! as HTMLCanvasElement;
    const topbar = document.getElementById("topbar")!;
    canvas.height = topbar.clientHeight;
    canvas.width = topbar.clientWidth;
}
window.addEventListener("resize",handle_sizing_topbar_canvas);


const TopBar: React.FC = ()=>{
  const title = "Brian";
  let title_ref  = React.useRef(HTMLCanvasElement.prototype);
  React.useEffect(animate_topbar_flag,[title_ref])
  return (
    <>
    <canvas id="topbar_canvas" ref={title_ref}/>
    <div  id="topbar">
    <h1  className="debug">{title}</h1>
    </div>
    </>
  );
}

export default TopBar;
