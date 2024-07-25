const express = require("express");
const db = require("../db/config/db.config");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.get("/courses", (_req, res) => {
  try {
    db.query(
      `SELECT c.course_id, c.course_name, c.course_description, c.instructor_id, c.course_price, u.full_name as instructor_name
      FROM Course c
      JOIN User u ON c.instructor_id = u.user_id;`,
      async (err, results) => {
        if (err) {
          console.error("Error querying courses:", err);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/enrollments", verifyToken, (req, res) => {
  try {
    db.query(
      `SELECT 
            c.course_id,
            c.course_name,
            c.course_description,
            c.course_price,
            u.full_name AS instructor_name
        FROM 
            Enrollment e
        JOIN 
            Course c ON e.course_id = c.course_id
        JOIN
            User u ON c.instructor_id = u.user_id
        WHERE 
            e.student_id = ?;
        `,
      [req.userId],
      async (err, results) => {
        if (err) {
          console.error("Error querying enrollments:", err);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
