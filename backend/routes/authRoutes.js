import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// SIGNUP
router.post("/signup", signup);

// LOGIN
router.post("/login", login);

export default router;
