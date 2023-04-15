import { FC } from "react";
import { Box } from "@mui/material";
import Right from "./content/Right";
import About from "./content/About";
import Left from "./content/Left";

const Content: FC = ()=>{
  return (<>
    <Right/>
    <Left/>
    </>
  );
} 

export default Content;
