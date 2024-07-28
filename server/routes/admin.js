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

function formatDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

router.get("/metrics/export", (_req, res) => {
  try {
    db.query(
      `
      SELECT 
        *
      FROM 
        Sale
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
          sale_date: formatDate(row.sale_date),
          fee_generated: parseFloat((row.sale_price * 0.1).toFixed(2)),
        }));
        const fields = [
          "sale_id",
          "student_id",
          "instructor_id",
          "course_id",
          "sale_date",
          "sale_price",
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
