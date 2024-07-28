const express = require("express");
const db = require("../db/config/db.config");
require("dotenv").config();
const { Parser } = require("json2csv");

const router = express.Router();

router.post("/authenticate", (req, res) => {
  const key = req.body.adminKey;

  if (key === process.env.ADMIN_KEY) {
    res.status(200).json({
      success: true,
      message: "Authenticated",
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Forbidden - Invalid admin key",
    });
  }
});

router.get("/metrics/export", (_req, res) => {
  try {
    db.query(
      `
      SELECT 
        e.enrollment_date,
        e.enrollment_id,
        e.student_id,
        c.instructor_id,
        c.course_price
      FROM 
        Enrollment e
      JOIN 
        Course c ON e.course_id = c.course_id
      WHERE 
        c.course_price > 0
      `,
      (err, results) => {
        if (err) {
          console.error("Error fetching metrics:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        const salesData = results.map((row) => ({
          ...row,
          fee_generated: parseFloat((row.course_price * 0.1).toFixed(2)),
        }));
        const fields = [
          "enrollment_date",
          "enrollment_id",
          "student_id",
          "instructor_id",
          "course_price",
          "fee_generated",
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(salesData);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=platform_metrics_export.csv"
        );
        res.status(200).send(csv);
      }
    );
  } catch (error) {
    console.error("Error exporting metrics:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
