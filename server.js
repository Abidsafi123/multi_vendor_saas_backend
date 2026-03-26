import express from "express";
import dotenv from "dotenv";
import { createApp } from "./app.js"; // adjust path if your file is in src/
import connectDb from "./config/db.js"; // adjust path

 
dotenv.config();

 connectDb();

 const app = createApp();

// 4️ Start server on dynamic port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});