import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (_req, res)=>{
  res.send("HELLO WORLD!\n");
})

app.listen(PORT, ()=>{
  console.log("Server listening on port 4000");
});
