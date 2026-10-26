import cookieParser from "cookie-parser";
import express from "express";
import healthRouter from "./routes/health.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

//GET health api
app.use("/api", healthRouter);

export default app;
