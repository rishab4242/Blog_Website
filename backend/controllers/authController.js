import { connection } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// -------------------- SIGNUP --------------------
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = `
      INSERT INTO users (username, email, password)
      VALUES (?,?,?)
    `;

    connection.query(q, [username, email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ message: "Database Error" });
      }

      res.status(200).json({ message: "Signup Successfully!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  const q = `SELECT * FROM users WHERE email = ?`;

  connection.query(q, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

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
    } catch (error) {
      res.status(500).json({ message: "Auth error" });
    }
  });
};
