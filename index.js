import express from "express";
import { client } from "./db.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { studentRouter } from "./routes/routes.js";

let port = process.env.port;
let app = express();
app.use(cors())

app.use(express.json())
app.use("/", studentRouter)

app.listen(port, ()=>{
    console.log("server connected");
})
