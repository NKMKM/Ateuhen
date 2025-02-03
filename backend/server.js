const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


const JWT_SECRET = process.env.JWT_SECRET;


const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, firstName: user.first_name, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' } 
  );
};

app.post('/auth/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, first_name, email',
      [firstName, lastName, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0]);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
    });

    res.status(201).json({ message: 'User created', user: newUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.rows[0]);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged in', user: { id: user.rows[0].id, firstName: user.rows[0].first_name, email: user.rows[0].email } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/auth/check', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
