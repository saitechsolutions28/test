const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "db.gefvwnefgnarsrkzeicc.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "TRXizw3wERx2Yk1P",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Database Error");
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server Running on Port", process.env.PORT);
});
