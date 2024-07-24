const express = require("express");
const cors = require("cors");
const db = require("./db/config/db.config");
const createTableQueries = require("./db/models/createTables");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middlewares/auth");
const cookieParser = require("cookie-parser");

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
); // can remove this in final build since frontend and backend will be on the same server
app.use(cookieParser());
app.use("/auth", authRoutes);

const createTables = async () => {
  for (const { name, query } of createTableQueries) {
    try {
      db.query(query);
      console.log(`Table '${name}' created or already exists.`);
    } catch (err) {
      console.error(`Error creating table '${name}':`, err.message);
    }
  }
};

createTables();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/", (_req, res) => {
  res.send("Chalkboard platform server is running.");
});
