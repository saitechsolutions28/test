const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

// API KEY
const API_KEY = process.env.API_KEY;

// Home
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Users API
app.get("/users", async (req, res) => {

  // Check API Key
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== API_KEY) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Database Error:", err);

    res.status(500).json({
      message: err.message,
      code: err.code
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port ${process.env.PORT}`);
});
