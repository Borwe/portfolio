import { Box, Typography } from "@mui/material";
import { Favorite} from "@mui/icons-material";
import { FC } from "react";

const Footer: FC = ()=>{
  return (<>
    <Box sx={{
      display: "block",
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "30px",
      zIndex: 100,
      backgroundColor: "white",
      textAlign: "center"
    }}>
    <Typography sx={{align: "center"}}>Made with <Favorite fontSize="small" sx={{color: "red"}}/> by Brian Orwe</Typography>
    </Box>
    </>)
}

export default Footer;
