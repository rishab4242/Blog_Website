import express from "express";
import {
  getAllBlogs,
  getBlogById,
  getBlogByIdView,
  searchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import { authMiddleware } from "../authMiddleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET all blogs
router.get("/", getAllBlogs);

// SEARCH blog
router.get("/search", searchBlog);

// CREATE blog
router.post("/create", authMiddleware, upload.single("img"), createBlog);

// VIEW blog (with isOwner logic)
router.get("/:id/view", authMiddleware, getBlogByIdView);

// GET single blog
router.get("/:id", authMiddleware, getBlogById);

// UPDATE blog
router.put("/:id/update", authMiddleware, upload.single("img"), updateBlog);

// DELETE blog
router.delete("/:id/delete", authMiddleware, deleteBlog);

export default router;
