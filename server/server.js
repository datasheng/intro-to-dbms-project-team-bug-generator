const express = require("express");
const cors = require("cors");
const db = require("./db/config/db.config");
const tablesProcedure = require("./db/models/tableProcedures");
const authProcedures = require("./db/models/authProcedures");
const sampleDataProcedure = require("./db/models/demoProcedures");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const studentRoutes = require("./routes/student");
const instructorRoutes = require("./routes/instructor");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = 3000;
const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", instructorRoutes);
app.use("/api/admin", adminRoutes);

const createTables = () => {
  try {
    db.query(tablesProcedure);
    console.log("Tables procedure created successfully.");

    db.query("CALL CreateTables()");
    console.log("Tables created or already exist.");
  } catch (err) {
    console.error("Error creating tables:", err.message);
  }
};

const createAuthProcedures = () => {
  for (const { name, query } of authProcedures) {
    try {
      db.query(query);
      console.log(`Auth procedure '${name}' created or already exists.`);
    } catch (err) {
      console.error(`Error creating stored procedure '${name}':`, err.message);
    }
  }
};

const addSampleData = async () => {
  try {
    db.query(sampleDataProcedure);
    console.log("AddSampleData stored procedure created successfully.");

    db.query("CALL AddSampleData()");
    console.log("Sample data added or already exists.");
  } catch (err) {
    console.error("Error adding sample data:", err.message);
  }
};

const initializeDatabase = async () => {
  createTables();
  createAuthProcedures();
  addSampleData();
};

initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/", (_req, res) => {
  res.send("Chalkboard platform server is running.");
});
