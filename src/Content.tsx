import { FC } from "react";
import { Box } from "@mui/material";
import Right from "./content/Right";
import "./content/Content.css";
import About from "./content/About";

const Content: FC = ()=>{
  return (<>
    <Right/>
    <Box id="left"><About /></Box>
    </>
  );
} 

export default Content;
