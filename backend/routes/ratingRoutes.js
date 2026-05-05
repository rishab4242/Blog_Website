import express from "express";
import {
  addRating,
  getRatingsByBlog,
  deleteRating,
} from "../controllers/ratingController.js";

import { authMiddleware } from "../authMiddleware/authMiddleware.js";

const router = express.Router();

// ADD rating
router.post("/:id/rating", authMiddleware, addRating);

// GET ratings for blog
router.get("/:id/rating", authMiddleware, getRatingsByBlog);

// DELETE rating
router.delete("/:id/rating/delete", authMiddleware, deleteRating);

export default router;
