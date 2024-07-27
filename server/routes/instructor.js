const express = require("express");
const db = require("../db/config/db.config");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.get("/instructor/courses", verifyToken, (req, res) => {
  try {
    db.query(
      `SELECT 
            course_id,
            course_name,
            course_description,
            course_price,
            course_details
        FROM 
            Course
        WHERE 
            instructor_id = ?;
        `,
      [req.userId],
      async (err, results) => {
        if (err) {
          console.error("Error querying user courses:", err);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/course/enrollments", verifyToken, (req, res) => {
  try {
    db.query(
      `SELECT u.full_name, u.email
      FROM User u
      JOIN Enrollment e ON u.user_id = e.student_id
      WHERE e.course_id = ?;
        `,
      [req.courseId],
      async (err, results) => {
        if (err) {
          console.error("Error querying user courses:", err);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
