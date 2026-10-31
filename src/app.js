import cookieParser from "cookie-parser";
import express from "express";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import requestMiddleware from "./middlewares/request.middleware.js";

import helmet from "helmet";

const app = express();

// cookie parser is only used for accessing the req.cookies.token data
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use(requestMiddleware.checkRequestOrigin);

//GET health api
app.use("/api", healthRouter);

// AUTH API
app.use("/api/auth", authRouter);

// unknown route handler
app.use((req, res) => {
  res.status(404).json({
    message: "route not found",
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === "entity.too.large")
    return res.status(413).json({ message: "request too large" });
  if (err.type === "entity.parse.failed")
    return res.status(400).json({ message: "Invalid JSON" });
  return res.status(500).json({ message: "something went wrong" });
});

export default app;
