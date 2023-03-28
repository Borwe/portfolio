import express from "express";

const app = express();
const PORT: number = process.env.PORT==undefined?4000:+process.env.PORT.trim();

app.get("/", (_req, res)=>{
  res.send("HELLO WORLD!\n");
})

app.listen(PORT, ()=>{
  console.log("Server listening on port 4000");
});
