import express from "express";

import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import app from "./src/app.js";

dotenv.config();

connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
