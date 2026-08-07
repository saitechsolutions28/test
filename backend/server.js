const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Supabase Postgres Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint to fetch current database time or sample data
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as db_time, version();');
    res.json({
      success: true,
      message: "Database connected successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Express endpoint in server.js
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, email FROM users;');
    res.json(result.rows);
  } catch (err) {
    console.error('Database Error:', err.message);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});
