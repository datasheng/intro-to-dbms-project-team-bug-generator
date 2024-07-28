const express = require("express");
const db = require("../db/config/db.config");
require("dotenv").config();

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

router.get("/metrics/export", (req, res) => {
  // todo
});

module.exports = router;
