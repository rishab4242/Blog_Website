import express from "express";
import {
  createOrder,
  validatePayment,
} from "../controllers/orderController.js";

const router = express.Router();

// CREATE order
router.post("/", createOrder);

// VALIDATE payment
router.post("/validate", validatePayment);

export default router;