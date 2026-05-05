import { connection } from "../config/db.js";

// -------------------- ADD RATING --------------------
export const addRating = (req, res) => {
  const { id } = req.params; // blog_id
  const user_id = req.user.id;
  const { rating, description } = req.body;

  const insertQuery = `
    INSERT INTO ratings (user_id, blog_id, rating, description)
    VALUES (?,?,?,?)
  `;

  connection.query(insertQuery, [user_id, id, rating, description], (err) => {
    if (err) return res.status(500).json(err);

    // Update average rating properly
    const avgQuery = `
        UPDATE blogs
        SET average_rating = (
          SELECT AVG(rating) FROM ratings WHERE blog_id = ?
        )
        WHERE id = ?
      `;

    connection.query(avgQuery, [id, id]);

    res.json({ message: "Rating added successfully" });
  });
};

// -------------------- GET ALL RATINGS OF A BLOG --------------------
export const getRatingsByBlog = (req, res) => {
  const blogId = req.params.id;
  const currentUserId = req.user.id;

  const q = `
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
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// -------------------- DELETE RATING --------------------
export const deleteRating = (req, res) => {
  const currentUserId = req.user.id;
  const ratingId = req.params.id;

  // Step 1: get blog_id
  const getBlogQuery = `
    SELECT blog_id FROM ratings
    WHERE id = ? AND user_id = ?
  `;

  connection.query(getBlogQuery, [ratingId, currentUserId], (err, data) => {
    if (err) return res.status(500).json(err);

    if (!data.length) {
      return res.status(404).json({ message: "Rating not found" });
    }

    const blogId = data[0].blog_id;

    // Step 2: delete rating
    const deleteQuery = `
      DELETE FROM ratings
      WHERE id = ? AND user_id = ?
    `;

    connection.query(deleteQuery, [ratingId, currentUserId], (err2) => {
      if (err2) return res.status(500).json(err2);

      // Step 3: recalculate average (IMPORTANT FIX)
      const updateAvg = `
        UPDATE blogs
        SET average_rating = (
          SELECT IFNULL(AVG(rating), 0)
          FROM ratings
          WHERE blog_id = ?
        )
        WHERE id = ?
      `;

      connection.query(updateAvg, [blogId, blogId], (err3) => {
        if (err3) return res.status(500).json(err3);

        res.json({ message: "Rating Deleted" });
      });
    });
  });
};
