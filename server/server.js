const express = require("express");
const db = require("./db/config/db.config");
const createTableQueries = require("./db/models/createTables");

const app = express();
const PORT = 3000;

app.use(express.json());

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
