import express from "express";
import authController from "../controllers/auth.controller.js";
import userModel from "../models/user.model.js";

const router = express.Router();

// POST /register
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

//test
router.get("/test", async (req, res) => {
  const users = await userModel.find({});
  return res.status(200).json({
    message: "successfuly user retrieved",
    users,
  });
});
export default router;
