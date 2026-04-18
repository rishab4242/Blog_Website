import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import upload from "./config/multer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware/authMiddleware.js";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

let app = express();

let PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "blog_website",
  password: "root",
});

app.get("/blogs", (req, res) => {
  let q = `SELECT * FROM blogs`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let blog = result;
      res.send(blog);
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/blogs/:id/view", authMiddleware, (req, res) => {
  const currentUserId = req.user.id;

  const { id } = req.params;

  let q = `SELECT * FROM blogs WHERE id = ?`;

  connection.query(q, [id], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      return res.status(404).send("Blog not found");
    }

    let blog = result[0]; // 👈 important

    blog.isOwner = blog.user_id === currentUserId;
    res.send(blog);
  });
});

app.get("/blogs/search", (req, res) => {
  let { title } = req.query;

  let q1 = `SELECT * FROM blogs WHERE title LIKE ? LIMIT 1`;

  try {
    connection.query(q1, [`%${title}%`], (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        return res.status(404).json({ message: "No Data Found" });
      }

      res.send(result[0]);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/blogs/create", authMiddleware, upload.single("img"), (req, res) => {
  const { title, price, content, description } = req.body;
  const user_id = req.user.id;
  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }
  const image = req.file.filename;

  const q = `INSERT INTO blogs (title, image, price, content, description, user_id) VALUES (?,?,?,?,?,?)`;

  try {
    connection.query(
      q,
      [title, image, price, content, description, user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Database error:", err);
        }

        res.send("Blog Created Successfully");
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.get("/blogs/:id", authMiddleware, (req, res) => {
  let { id } = req.params;
  let q1 = `SELECT * FROM blogs WHERE id=${id}`;

  try {
    connection.query(q1, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "No Data Found" });
  }
});

app.put(
  "/blogs/:id/update",
  authMiddleware,
  upload.single("img"),
  (req, res) => {
    const { title, price, content, description } = req.body;
    const userId = req.user.id;
    const { id } = req.params;

    const q = "SELECT * FROM blogs WHERE id=?";

    connection.query(q, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }

      if (result[0].user_id !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      let image = req.file ? req.file.filename : null;

      let q1;
      let values;

      if (image) {
        q1 =
          "UPDATE blogs SET title=?, image=?, price=?, content=?, description=? WHERE id=?";
        values = [title, image, price, content, description, id];
      } else {
        q1 =
          "UPDATE blogs SET title=?, price=?, content=?, description=? WHERE id=?";
        values = [title, price, content, description, id];
      }

      connection.query(q1, values, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Update failed" });
        }

        res.status(200).json({ message: "Blog Updated Successfully" });
      });
    });
  },
);

app.delete("/blogs/:id/delete", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  connection.query("SELECT * FROM blogs WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    if (result[0].user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    connection.query("DELETE FROM blogs WHERE id=?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Delete failed" });

      res.status(200).json({ message: "Deleted successfully" });
    });
  });
});

app.post("/blogs/:id/rating", authMiddleware, (req, res) => {
  let { id } = req.params;
  const user_id = req.user.id;
  let { rating, description } = req.body;

  let insertQuery =
    "INSERT INTO ratings (user_id, blog_id, rating, description) VALUES (?,?, ?, ?)";

  connection.query(
    insertQuery,
    [user_id, id, rating, description],
    (err, result) => {
      if (err) return res.status(500).send(err);

      // 🔥 UPDATE AVERAGE RATING
      const avgQuery = `
        UPDATE blogs 
        SET average_rating = (
          SELECT AVG(rating) FROM ratings WHERE blog_id = ?
        )
        WHERE id = ?
      `;

      connection.query(avgQuery, [id, id]);

      res.json({ message: "Rating added successfully" });
    },
  );
});

app.get("/blogs/:id/rating", authMiddleware, (req, res) => {
  const blogId = req.params.id;
  const currentUserId = req.user.id;

  let q = `
    SELECT 
      id, 
      user_id, 
      rating, 
      description,
      (user_id = ?) AS isOwner
    FROM ratings
    WHERE blog_id = ?
  `;

  connection.query(q, [currentUserId, blogId], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json(result);
  });
});

app.delete("/blogs/:id/rating/delete", authMiddleware, (req, res) => {
  const currentUserId = req.user.id;
  const ratingId = req.params.id;

  // 🔥 STEP 1: get blog_id FIRST
  const getBlogQuery = `SELECT blog_id FROM ratings WHERE id = ? AND user_id = ?`;

  connection.query(getBlogQuery, [ratingId, currentUserId], (err, data) => {
    if (err) return res.status(500).json(err);

    const blogId = data[0]?.blog_id;

    if (!blogId) {
      return res.status(404).json({ message: "Rating not found" });
    }

    // 🔥 STEP 2: delete rating
    const deleteQuery = `DELETE FROM ratings WHERE id = ? AND user_id = ?`;

    connection.query(deleteQuery, [ratingId, currentUserId], (err2) => {
      if (err2) return res.status(500).json(err2);

      // 🔥 STEP 3: reset blog rating
      const updateQuery = `
        UPDATE blogs 
        SET average_rating = 0
        WHERE id = ?
      `;

      connection.query(updateQuery, [blogId], (err3) => {
        if (err3) return res.status(500).json(err3);

        res.json({ message: "Rating Deleted" });
      });
    });
  });
});

app.post("/blogs/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const q1 = `INSERT INTO users (username, email, password) VALUES (?,?,?)`;

  try {
    connection.query(q1, [username, email, hashedPassword], (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "Signup Successfully!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Databse Error!!" });
  }
});

app.post("/blogs/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Fetch user by email
    const q1 = "SELECT * FROM users WHERE email = ?";
    connection.query(q1, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0]; // first matched user
      const hashedPassword = user.password;

      // 2️⃣ Compare password using bcrypt
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          role: "user",
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.status(200).json({
        message: "Login successful",
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Error" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "something went wrong!" });
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET); // i am define the HMAC generator  macine setup using sha256 algorithm with my s_key
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`); // passing data to Hasing machine
  const digest = sha.digest("hex"); // this code give it final output means youre hansing string will be here

  if (digest !== razorpay_signature) {
    return res.status(400).json({ message: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
