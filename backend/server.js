const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://achudhaloans.in/",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

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

// Test Database
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.log("DB Error :", err));

// Home
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// ---------------- INSERT ----------------

app.post("/insert", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email required",
      });
    }

    await pool.query(
      "INSERT INTO users(name,email) VALUES($1,$2)",
      [name, email]
    );

    res.json({
      success: true,
      message: "User Added Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Insert Failed",
    });
  }
});

// ---------------- UPDATE ----------------

app.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const result = await pool.query(
      "UPDATE users SET name=$1,email=$2 WHERE id=$3",
      [name, email, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      message: "User Updated",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Update Failed",
    });
  }
});

// ---------------- DELETE ----------------

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      "DELETE FROM users WHERE id=$1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      message: "User Deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Delete Failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
