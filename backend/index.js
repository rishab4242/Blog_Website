import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/blogs", blogRoutes);
app.use("/blogs", authRoutes);
app.use("/blogs", ratingRoutes);
app.use("/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
