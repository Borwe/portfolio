import { FC } from "react";
import Right from "./content/Right";
import Left from "./content/Left";
import { Box } from "@mui/material";
import "./Content.css";

const Content: FC = ()=>{
  return (<>
    <Box id="right"><Right/></Box>
    <Box id="left"><Left /></Box>
    </>
  );
} 

export default Content;
