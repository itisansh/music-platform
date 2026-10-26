import getHealth from "../controllers/health.controller.js";
import express from "express";

const router = express.Router();

router.get("/health", getHealth);

export default router;
