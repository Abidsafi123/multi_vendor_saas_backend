import dotenv from "dotenv";
dotenv.config(); // 1️⃣ load env first

import { createApp } from "./src/app.js";
import connectDb from "./src/config/db.js";

const startServer = async () => {
  try {
    await connectDb(); // 2️⃣ wait for DB connection
    console.log("Database connected ✅");

    const app = createApp(); // 3️⃣ create app after DB

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port} ✅`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();