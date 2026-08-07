const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// ==========================================
// 1. Middlewares
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// 2. Database Connection (Supabase PostgreSQL)
// ==========================================
const pool = new Pool({
  host: process.env.DB_HOST || 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres.gefvwnefgnarsrkzeicc',
  password: process.env.DB_PASSWORD || 'TRXizw3wERx2Yk1P',
  ssl: {
    rejectUnauthorized: false // Required for Supabase SSL connection
  }
});

// Test Database Connection on Startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to Supabase PostgreSQL database!');
  release();
});

// ==========================================
// 3. API Routes
// ==========================================

// Root / Health-check route
app.get('/', (req, res) => {
  res.send('API Server is running successfully!');
});

// GET Endpoint: Fetch name & email from users table
app.get('/api/users', async (req, res) => {
  try {
    const query = 'SELECT name, email FROM users;';
    const { rows } = await pool.query(query);
    
    res.status(200).json(rows);
  } catch (err) {
    console.error('Database Query Error:', err.message);
    res.status(500).json({ 
      error: 'Failed to fetch users from database', 
      details: err.message 
    });
  }
});

// POST Endpoint: Optional route to insert new users
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
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
      error: 'Failed to insert user into database', 
      details: err.message 
    });
  }
});

// ==========================================
// 4. Server Initialization
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
