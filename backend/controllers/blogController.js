import { connection } from "../config/db.js";
import fs from "fs";

// -------------------- GET ALL BLOGS --------------------
export const getAllBlogs = (req, res) => {
  const q = `SELECT * FROM blogs`;

  connection.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// -------------------- GET BLOG BY ID (AUTH + OWNER CHECK) --------------------
export const getBlogByIdView = (req, res) => {
  const currentUserId = req.user.id;
  const { id } = req.params;

  const q = `SELECT * FROM blogs WHERE id = ?`;

  connection.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).send("Blog not found");
    }

    const blog = result[0];
    blog.isOwner = blog.user_id === currentUserId;

    res.json(blog);
  });
};

// -------------------- SEARCH BLOG --------------------
export const searchBlog = (req, res) => {
  const { title } = req.query;

  const q = `SELECT * FROM blogs WHERE title LIKE ? LIMIT 1`;

  connection.query(q, [`%${title}%`], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }

    res.json(result);
  });
};

// -------------------- CREATE BLOG --------------------
export const createBlog = (req, res) => {
  const { title, price, content, description } = req.body;
  const user_id = req.user.id;

  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }

  const image = req.file.path;

  const q = `
    INSERT INTO blogs (title, image, price, content, description, user_id)
    VALUES (?,?,?,?,?,?)
  `;

  connection.query(
    q,
    [title, image, price, content, description, user_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Blog Created Successfully" });
    },
  );
};

// -------------------- GET SINGLE BLOG (RAW) --------------------
export const getBlogById = (req, res) => {
  const { id } = req.params;

  const q = `SELECT * FROM blogs WHERE id = ?`;

  connection.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// -------------------- UPDATE BLOG --------------------
export const updateBlog = (req, res) => {
  const { title, price, content, description } = req.body;
  const userId = req.user.id;
  const { id } = req.params;

  const q = `SELECT * FROM blogs WHERE id=?`;

  connection.query(q, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (result[0].user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let image = req.file ? req.file.path : null;

    let q1;
    let values;

    if (image) {
      q1 = `
        UPDATE blogs
        SET title=?, image=?, price=?, content=?, description=?
        WHERE id=?
      `;
      values = [title, image, price, content, description, id];
    } else {
      q1 = `
        UPDATE blogs
        SET title=?, price=?, content=?, description=?
        WHERE id=?
      `;
      values = [title, price, content, description, id];
    }

    connection.query(q1, values, (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Blog Updated Successfully" });
    });
  });
};

// -------------------- DELETE BLOG --------------------
export const deleteBlog = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  connection.query("SELECT * FROM blogs WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    // if (result[0].image) {
    //   fs.unlink(result[0].image, (err) => {
    //     if (err) console.log("Image delete error:", err);
    //   });
    // }

    if (result[0].user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    connection.query("DELETE FROM blogs WHERE id=?", [id], (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Deleted successfully" });
    });
  });
};
