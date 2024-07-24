const express = require("express");
const db = require("../db/config/db.config");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .send({ success: false, message: "All fields are required" });
  }

  try {
    db.query(
      "SELECT * FROM User WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Error querying user:", err);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .send({ success: false, message: "Email already in use" });
        }

        const hashedPassword = await argon2.hash(password, {
          type: argon2.argon2id,
        });

        db.query(
          "INSERT INTO User (user_id, full_name, email, password) VALUES (UUID(), ?, ?, ?)",
          [fullName, email, hashedPassword],
          (err, results) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res
                .status(500)
                .send({ success: false, message: "Internal Server Error" });
            }
            res
              .status(201)
              .send({ success: true, message: "Registration successful" });
          }
        );
      }
    );
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ success: false, message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM User WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error querying user:", err);
        return res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      const user = results[0];
      try {
        const passwordIsValid = await argon2.verify(user.password, password, {
          type: argon2.argon2id,
        });

        if (!passwordIsValid) {
          return res
            .status(403)
            .send({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.user_id }, SECRET_KEY, {
          expiresIn: 86400,
        });

        res.cookie("auth", token, {
          httpOnly: true,
          maxAge: 86400 * 1000,
        });
        res.status(200).send({ success: true, message: "Login successful" });
      } catch (err) {
        console.error("Error verifying password:", err);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    }
  );
});

module.exports = router;
