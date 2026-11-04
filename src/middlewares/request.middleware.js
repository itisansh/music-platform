import dotenv from "dotenv";
dotenv.config();

import rateLimit from "express-rate-limit";

async function checkRequestOrigin(req, res, next) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  // GET/HEAD/OPTIONS are safe - Let them through
  if (safeMethods.includes(req.method)) {
    return next();
  }
  // For writes - checks the Origin header
  // browsers sends req.headers.origin automatically
  const origin = req.headers.origin;

  if (!origin || origin !== process.env.APP_ORIGIN) {
    return res.status(403).json({
      message: "forbidden",
    });
  }
  next();
}

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "too many requests, slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

export default { checkRequestOrigin, authLimiter };
