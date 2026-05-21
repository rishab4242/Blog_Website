import { pool  } from "../config/db.js";
import fs from "fs";

// -------------------- GET ALL BLOGS --------------------
export const getAllBlogs = async (req, res) => {
  const q = `SELECT * FROM blogs`;

  try {
    const result = await connection.query(q);
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- GET BLOG BY ID (AUTH + OWNER CHECK) --------------------
export const getBlogByIdView = async (req, res) => {
  const currentUserId = req.user.id;
  const { id } = req.params;

  const q = `
    SELECT blogs.*, users.username AS ownerName
    FROM blogs
    INNER JOIN users
    ON blogs.user_id = users.id
    WHERE blogs.id = $1
  `;

  try {
    const result = await connection.query(q, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Blog not found");
    }

    const blog = result.rows[0];

    blog.isOwner = blog.user_id === currentUserId;

    res.json(blog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- SEARCH BLOG --------------------
export const searchBlog = async (req, res) => {
  const { title } = req.query;

  const q = `SELECT * FROM blogs WHERE title ILIKE $1 LIMIT 1`;

  try {
    const result = await connection.query(q, [`%${title}%`]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }

    res.json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- CREATE BLOG --------------------
export const createBlog = async (req, res) => {
  const { title, price, content, description } = req.body;
  const user_id = req.user.id;

  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }

  const image = req.file.path;

  const q = `
    INSERT INTO blogs (title, image, price, content, description, user_id)
    VALUES ($1,$2,$3,$4,$5,$6)
  `;

  try {
    await connection.query(q, [
      title,
      image,
      price,
      content,
      description,
      user_id,
    ]);

    res.json({ message: "Blog Created Successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- GET SINGLE BLOG (RAW) --------------------
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  const q = `SELECT * FROM blogs WHERE id = $1`;

  try {
    const result = await connection.query(q, [id]);
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- UPDATE BLOG --------------------
export const updateBlog = async (req, res) => {
  const { title, price, content, description } = req.body;
  const userId = req.user.id;
  const { id } = req.params;

  const q = `SELECT * FROM blogs WHERE id=$1`;

  try {
    const result = await connection.query(q, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (result.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let image = req.file ? req.file.path : null;

    let q1;
    let values;

    if (image) {
      q1 = `
        UPDATE blogs
        SET title=$1, image=$2, price=$3, content=$4, description=$5
        WHERE id=$6
      `;

      values = [title, image, price, content, description, id];
    } else {
      q1 = `
        UPDATE blogs
        SET title=$1, price=$2, content=$3, description=$4
        WHERE id=$5
      `;

      values = [title, price, content, description, id];
    }

    await connection.query(q1, values);

    res.json({ message: "Blog Updated Successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- DELETE BLOG --------------------
export const deleteBlog = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await connection.query("SELECT * FROM blogs WHERE id=$1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    // if (result.rows[0].image) {
    //   fs.unlink(result.rows[0].image, (err) => {
    //     if (err) console.log("Image delete error:", err);
    //   });
    // }

    if (result.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await connection.query("DELETE FROM blogs WHERE id=$1", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};
