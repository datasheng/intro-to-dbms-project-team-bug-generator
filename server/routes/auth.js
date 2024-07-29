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
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    db.query(
      "CALL RegisterUser(?, ?, ?, @success, @message)",
      [fullName, email, hashedPassword],
      (err) => {
        if (err) {
          console.error("Error calling RegisterUser procedure:", err);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }
        db.query(
          "SELECT @success AS success, @message AS message",
          (err, results) => {
            if (err) {
              console.error("Error retrieving procedure results:", err);
              return res
                .status(500)
                .send({ success: false, message: "Internal Server Error" });
            }
            const { success, message } = results[0];
            res.status(success ? 201 : 400).send({ success, message });
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
    "CALL LoginUser(?, @user_id, @full_name, @hashed_password, @success, @message)",
    [email],
    async (err) => {
      if (err) {
        console.error("Error calling LoginUser procedure:", err);
        return res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
      db.query(
        "SELECT @user_id AS user_id, @full_name AS full_name, @hashed_password AS hashed_password, @success AS success, @message AS message",
        async (err, results) => {
          if (err) {
            console.error("Error retrieving procedure results:", err);
            return res
              .status(500)
              .send({ success: false, message: "Internal Server Error" });
          }
          const { user_id, full_name, hashed_password, success, message } =
            results[0];
          if (!success) {
            return res.status(404).send({ success, message });
          }

          try {
            const passwordIsValid = await argon2.verify(
              hashed_password,
              password,
              {
                type: argon2.argon2id,
              }
            );

            if (!passwordIsValid) {
              return res
                .status(403)
                .send({ success: false, message: "Invalid password" });
            }

            const token = jwt.sign(
              { id: user_id, name: full_name },
              SECRET_KEY,
              {
                expiresIn: 86400,
              }
            );
            res.status(200).send({
              success: true,
              message: "Login successful",
              auth: token,
              displayName: full_name,
            });
          } catch (err) {
            console.error("Error verifying password:", err);
            res
              .status(500)
              .send({ success: false, message: "Internal Server Error" });
          }
        }
      );
    }
  );
});

const verifyToken = require("../middlewares/auth");

router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token successfully validated",
    user: {
      id: req.userId,
      name: req.userFullName,
    },
  });
});

module.exports = router;
