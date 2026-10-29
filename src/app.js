import cookieParser from "cookie-parser";
import express from "express";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

//GET health api
app.use("/api", healthRouter);

// AUTH API
app.use("/api/auth", authRouter);



export default app;
