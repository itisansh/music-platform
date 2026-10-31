import express from "express";
import userAuth from "../middlewares/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
import requestMiddleware from "../middlewares/request.middleware.js";

const router = express.Router();

// POST /register
router.post(
  "/register",
  requestMiddleware.authLimiter,
  authController.registerUser,
);
router.post("/login", requestMiddleware.authLimiter, authController.loginUser);
router.post("/logout", userAuth, authController.logoutUser);

//test
router.get("/me", userAuth, authController.getMe);

export default router;