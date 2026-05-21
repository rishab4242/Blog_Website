import { pool } from "../config/db.js";

// -------------------- ADD RATING --------------------
export const addRating = async (req, res) => {
  const { id } = req.params; // blog_id
  const user_id = req.user.id;
  const { rating, description } = req.body;

  const insertQuery = `
    INSERT INTO ratings (user_id, blog_id, rating, description)
    VALUES ($1,$2,$3,$4)
  `;

  try {
    await pool.query(insertQuery, [user_id, id, rating, description]);

    // Update average rating properly
    const avgQuery = `
      UPDATE blogs
      SET average_rating = (
        SELECT AVG(rating)
        FROM ratings
        WHERE blog_id = $1
      )
      WHERE id = $2
    `;

    await pool.query(avgQuery, [id, id]);

    res.json({ message: "Rating added successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- GET ALL RATINGS OF A BLOG --------------------
export const getRatingsByBlog = async (req, res) => {
  const blogId = req.params.id;
  const currentUserId = req.user.id;

  const q = `
    SELECT 
      id,
      user_id,
      rating,
      description,
      (user_id = $1) AS "isOwner"
    FROM ratings
    WHERE blog_id = $2
  `;

  try {
    const result = await pool.query(q, [currentUserId, blogId]);

    res.json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// -------------------- DELETE RATING --------------------
export const deleteRating = async (req, res) => {
  const currentUserId = req.user.id;
  const ratingId = req.params.id;

  // Step 1: get blog_id
  const getBlogQuery = `
    SELECT blog_id FROM ratings
    WHERE id = $1 AND user_id = $2
  `;

  try {
    const data = await pool.query(getBlogQuery, [ratingId, currentUserId]);

    if (!data.rows.length) {
      return res.status(404).json({ message: "Rating not found" });
    }

    const blogId = data.rows[0].blog_id;

    // Step 2: delete rating
    const deleteQuery = `
      DELETE FROM ratings
      WHERE id = $1 AND user_id = $2
    `;

    await pool.query(deleteQuery, [ratingId, currentUserId]);

    // Step 3: recalculate average
    const updateAvg = `
      UPDATE blogs
      SET average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM ratings
        WHERE blog_id = $1
      )
      WHERE id = $2
    `;

    await pool.query(updateAvg, [blogId, blogId]);

    res.json({ message: "Rating Deleted" });
  } catch (err) {
    return res.status(500).json(err);
  }
};
