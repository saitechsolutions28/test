const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // Loads environment variables from .env file

const app = express();

// ==========================================
// 1. Middlewares
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// 2. Database Connection using process.env
// ==========================================
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Required for Supabase pooler connections
  }
});

// Verify connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to Supabase PostgreSQL database via .env variables!');
    release();
  }
});

// ==========================================
// 3. API Routes
// ==========================================

// Health Check
app.get('/', (req, res) => {
  res.send('API Server is running successfully!');
});

// GET: Fetch name and email from users table
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name, email FROM users;');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ 
      error: 'Failed to fetch users from database', 
      details: err.message 
    });
  }
});

// POST: Add a new user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const insertQuery = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING name, email;';
    const { rows } = await pool.query(insertQuery, [name, email]);

    res.status(201).json({
      message: 'User created successfully',
      user: rows[0]
    });
  } catch (err) {
    console.error('Database Insert Error:', err.message);
    res.status(500).json({ 
      error: 'Failed to insert user', 
      details: err.message 
    });
  }
});

// ==========================================
// 4. Server Listener
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
