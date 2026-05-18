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
      VALUES ($1,$2,$3)
    `;

    await connection.query(q, [username, email, hashedPassword]);

    res.status(200).json({ message: "Signup Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Database Error" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  const q = `SELECT * FROM users WHERE email = $1`;

  try {
    const result = await connection.query(q, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
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
};
