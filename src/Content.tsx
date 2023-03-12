import { FC } from "react";
import { Box } from "@mui/material";
import Right from "./content/Right";
import "./content/Content.css";
import About from "./content/About";
import Grid from "@mui/material/Unstable_Grid2";

const Content: FC = ()=>{
  return (<>
    <Right/>
    {/*Used to store the pages, with a 7:5 screen covered*/}
    <Grid container mb="30px">
      <Grid xs={6}>
        <Box id="left"><About /></Box>
      </Grid>
      <Grid xs={6}>
      </Grid>
    </Grid>
    </>
  );
} 

export default Content;
