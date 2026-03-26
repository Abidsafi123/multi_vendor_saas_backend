import express from "express";
import dotenv from "dotenv";
import { createApp } from "./src/app.js";
import connectDb from "./src/config/db.js"
connectDb()
const app = createApp()
 
dotenv.config();

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
