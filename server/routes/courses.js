const express = require("express");
const db = require("../db/config/db.config");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/courses", async (req, res) => {
  try {
    db.query(
      "SELECT c.course_id, c.course_name, c.course_description, c.instructor_id, u.full_name as instructor_name FROM Course c JOIN User u ON c.instructor_id = u.user_id;",
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

module.exports = router;
