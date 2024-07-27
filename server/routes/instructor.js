const express = require("express");
const db = require("../db/config/db.config");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.get("/instructor/courses", verifyToken, (req, res) => {
  try {
    db.query(
      `SELECT 
            c.course_id,
            c.course_name,
            c.course_description,
            c.course_price,
            c.course_details,
            COUNT(CASE WHEN e.enrollment_status = 'active' THEN 1 END) AS total_students
        FROM 
            Course c
        LEFT JOIN
            Enrollment e ON c.course_id = e.course_id
        WHERE 
            c.instructor_id = ?
        GROUP BY
            c.course_id;
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

router.post("/instructor/courses/create", verifyToken, (req, res) => {
  const { course_name, course_description, course_details, course_price } =
    req.body;

  try {
    db.query(
      `INSERT INTO Course (course_id, course_name, course_description, course_details, course_price, instructor_id)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [
        course_name,
        course_description,
        course_details,
        course_price,
        req.userId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error creating new course:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        res.status(201).json({
          success: true,
          message: "Course created successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error creating new course:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/instructor/courses/update", verifyToken, (req, res) => {
  const {
    course_id,
    course_name,
    course_description,
    course_details,
    course_price,
  } = req.body;

  try {
    db.query(
      `UPDATE Course 
       SET course_name = ?, course_description = ?, course_details = ?, course_price = ?
       WHERE course_id = ? AND instructor_id = ?`,
      [
        course_name,
        course_description,
        course_details,
        course_price,
        course_id,
        req.userId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating course:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message:
              "Course not found or you don't have permission to update it",
          });
        }

        res.json({
          success: true,
          message: "Course updated successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/instructor/course/lessons", verifyToken, (req, res) => {
  const { courseId } = req.query;

  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Course ID is required" });
  }

  try {
    db.query(
      `SELECT 
          l.lesson_id,
          l.lesson_title,
          l.lesson_description,
          l.lesson_number
      FROM 
          Lesson l
      JOIN
          Course c ON l.course_id = c.course_id
      WHERE 
          c.course_id = ? AND c.instructor_id = ?
      ORDER BY
          l.lesson_number;
      `,
      [courseId, req.userId],
      (err, results) => {
        if (err) {
          console.error("Error querying course lessons:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching course lessons:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/instructor/course/lessons/update", verifyToken, (req, res) => {
  const {
    course_id,
    lesson_title,
    lesson_description,
    lesson_number,
    lesson_id,
  } = req.body;

  try {
    db.query(
      `UPDATE Lesson l
       JOIN Course c ON l.course_id = c.course_id
       SET l.lesson_title = ?, l.lesson_description = ?, l.lesson_number = ?
       WHERE l.lesson_id = ? AND l.course_id = ? AND c.instructor_id = ?`,
      [
        lesson_title,
        lesson_description,
        lesson_number,
        lesson_id,
        course_id,
        req.userId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating lesson:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message:
              "Lesson not found or you don't have permission to update it",
          });
        }

        res.json({
          success: true,
          message: "Lesson updated successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/instructor/course/lessons/delete", verifyToken, (req, res) => {
  const { course_id, lesson_id } = req.body;

  try {
    db.query(
      `DELETE l FROM Lesson l
       JOIN Course c ON l.course_id = c.course_id
       WHERE l.lesson_id = ? AND l.course_id = ? AND c.instructor_id = ?`,
      [lesson_id, course_id, req.userId],
      (err, result) => {
        if (err) {
          console.error("Error deleting lesson:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message:
              "Lesson not found or you don't have permission to delete it",
          });
        }

        res.json({
          success: true,
          message: "Lesson deleted successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/instructor/course/lessons/create", verifyToken, (req, res) => {
  const { courseId, lesson_title, lesson_description, lesson_number } =
    req.body;

  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Course ID is required" });
  }

  if (!lesson_title || !lesson_description || !lesson_number) {
    return res.status(400).json({
      success: false,
      message: "Lesson title, description, and number are required",
    });
  }

  try {
    db.query(
      `INSERT INTO Lesson (lesson_id, course_id, lesson_title, lesson_description, lesson_number)
       VALUES (UUID(), ?, ?, ?, ?)`,
      [courseId, lesson_title, lesson_description, lesson_number],
      (err, result) => {
        if (err) {
          console.error("Error creating new lesson:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        res.status(201).json({
          success: true,
          message: "Lesson created successfully",
          lessonId: result.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error creating new lesson:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/instructor/course/enrollments", verifyToken, (req, res) => {
  const { courseId } = req.query;

  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Course ID is required" });
  }

  try {
    db.query(
      `SELECT 
            u.full_name,
            u.email
        FROM 
            User u
        JOIN
            Enrollment e ON u.user_id = e.student_id
        JOIN
            Course c ON e.course_id = c.course_id
        WHERE 
            c.course_id = ?
            AND c.instructor_id = ?
            AND e.enrollment_status = 'active';
        `,
      [courseId, req.userId],
      async (err, results) => {
        if (err) {
          console.error("Error querying course enrollments:", err);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching course enrollments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/instructor/earnings", verifyToken, (req, res) => {
  try {
    db.query(
      `
      SELECT 
          e.enrollment_date,
          u.full_name AS student_full_name,
          u.email AS student_email,
          c.course_price,
          c.course_name
      FROM 
          Enrollment e
      JOIN 
          Course c ON e.course_id = c.course_id
      JOIN 
          User u ON e.student_id = u.user_id
      WHERE 
          c.instructor_id = ?
          AND c.course_price > 0.00;
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

module.exports = router;
