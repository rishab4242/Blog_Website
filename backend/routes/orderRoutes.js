import express from "express";
import {
  createOrder,
  validatePayment,
} from "../controllers/orderController.js";
import { authMiddleware } from "../authMiddleware/authMiddleware.js";

const router = express.Router();

// CREATE order
router.post("/", authMiddleware, createOrder);

// VALIDATE payment
router.post("/validate", authMiddleware, validatePayment);

export default router;
