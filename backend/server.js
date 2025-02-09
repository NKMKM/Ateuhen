const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const useragent = require('express-useragent');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(useragent.express());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true,  
}));

app.set('trust proxy', true);  

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const SECRET = process.env.JWT_SECRET || 'defaultsecret';

app.post('/auth/register', async (req, res) => {
  const { first_name, second_name, email, nickname, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const created_at = new Date();

  try {
    const userResult = await pool.query(
      "INSERT INTO users (first_name, second_name, email, nickname, password, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, second_name, email, nickname, hashedPassword, created_at]
    );

    const user = userResult.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

    const platform = req.useragent?.platform || 'Unknown';
    const browser = req.useragent?.browser || 'Unknown';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown IP';

    await pool.query(
      `INSERT INTO login_logs (user_id, device, browser, login_time, token, ip_address) 
       VALUES ($1, $2, $3, NOW(), $4, $5)`,
      [user.id, platform, browser, token, ipAddress]
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown IP';

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) {
    return res.status(400).json({ error: "User not found" });
  }

  const user = result.rows[0];

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

  const platform = req.useragent ? req.useragent.platform : 'Unknown platform';
  const browser = req.useragent ? req.useragent.browser : 'Unknown browser';

  await pool.query(
    `INSERT INTO login_logs (user_id, device, browser, login_time, token, ip_address) 
     VALUES ($1, $2, $3, NOW(), $4, $5)`,
    [user.id, platform, browser, token, ipAddress]
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  
    sameSite: 'Strict',  // защита от CSRF атак
  });

  res.json({ message: "Login successful", user });
}));

app.get('/auth/check', asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}));

app.post('/auth/logout', asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  
    sameSite: 'Strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
}));

app.get('/home', asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(200).send(`Welcome to the home page, ${decoded.email}`);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}));

app.get('/auth/sessions', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const sessions = await pool.query(
      "SELECT id, device, browser, login_time, ip_address FROM login_logs WHERE user_id = $1",
      [decoded.id]
    );
    res.json(sessions.rows);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.delete('/auth/sessions/:sessionId', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const { sessionId } = req.params;

    const session = await pool.query(
      "SELECT * FROM login_logs WHERE id = $1 AND user_id = $2",
      [sessionId, decoded.id]
    );

    if (session.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query("DELETE FROM login_logs WHERE id = $1", [sessionId]);

    if (session.rows[0].token === token) {
      res.clearCookie('token');
      return res.json({ message: "Session deleted, logging out", logout: true });
    }

    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
