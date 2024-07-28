const express = require("express");
const db = require("../db/config/db.config");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.get("/courses/all", (_req, res) => {
  try {
    db.query(
      `SELECT c.course_id, c.course_name, c.course_description, c.instructor_id, c.course_price, c.course_details, u.full_name as instructor_name
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

router.get("/student/enrollments", verifyToken, (req, res) => {
  try {
    db.query(
      `SELECT 
            c.course_id,
            c.course_name,
            c.course_description,
            c.course_price,
            c.course_details,
            u.full_name AS instructor_name,
            e.enrollment_status,
            e.enrollment_date,
            e.enrollment_id
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

router.post("/student/enrollments/create", verifyToken, (req, res) => {
  try {
    const { courseId } = req.body;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    db.query(
      `SELECT instructor_id FROM Course WHERE course_id = ?`,
      [courseId],
      (instructorErr, instructorResults) => {
        if (instructorErr) {
          console.error("Error checking course instructor:", instructorErr);
          return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
        }

        if (instructorResults.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Course not found" });
        }

        if (instructorResults[0].instructor_id === req.userId) {
          return res.status(400).json({
            success: false,
            message: "Instructors cannot enroll in their own courses",
          });
        }

        db.query(
          `SELECT * FROM Enrollment WHERE course_id = ? AND student_id = ? AND enrollment_status = 'active'`,
          [courseId, req.userId],
          (checkErr, checkResults) => {
            if (checkErr) {
              console.error("Error checking existing enrollment:", checkErr);
              return res
                .status(500)
                .send({ success: false, message: "Internal Server Error" });
            }

            if (checkResults.length > 0) {
              return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course",
              });
            }

            db.query(
              `INSERT INTO Enrollment (enrollment_id, course_id, student_id, enrollment_status, enrollment_date)
               VALUES (UUID(), ?, ?, 'active', ?);`,
              [courseId, req.userId, currentTimestamp],
              (err) => {
                if (err) {
                  console.error("Error creating enrollment:", err);
                  return res
                    .status(500)
                    .send({ success: false, message: "Internal Server Error" });
                }

                res.json({
                  success: true,
                  message: "Enrollment created successfully",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/student/enrollments/withdraw", verifyToken, (req, res) => {
  try {
    const { enrollmentId } = req.body;

    db.query(
      `UPDATE enrollment 
       SET enrollment_status = 'withdrawn'
       WHERE enrollment_id = ? AND student_id = ?`,
      [enrollmentId, req.userId],
      (err, result) => {
        if (err) {
          console.error("Error updating enrollment:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Enrollment not found or not authorized",
          });
        }

        res.json({
          success: true,
          message: "Enrollment withdrawn successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error updating enrollment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/student/course/lessons", verifyToken, (req, res) => {
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

router.get("/student/course/lesson/contents", verifyToken, (req, res) => {
  const { lessonId } = req.query;

  if (!lessonId) {
    return res
      .status(400)
      .json({ success: false, message: "Lesson ID is required" });
  }

  try {
    db.query(
      `
      SELECT 
          *
      FROM 
          Content
      WHERE 
          lesson_id = ?
      `,
      [lessonId],
      (err, results) => {
        if (err) {
          console.error("Error querying lesson contents:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error fetching lesson contents:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
