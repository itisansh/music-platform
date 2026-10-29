import cookieParser from "cookie-parser";
import express from "express";
import healthRouter from "./routes/health.routes.js";

// cookie parser is used for reading the cookies by req.cookies
const app = express();

app.use(express.json());
app.use(cookieParser());

//GET health api
app.use("/api", healthRouter);

app.use("/api", healthRouter);

export default app;
