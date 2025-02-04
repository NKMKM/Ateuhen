const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const useragent = require('express-useragent');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(useragent.express());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,  // Для работы с cookies
}));

app.set('trust proxy', true);  // Для работы с прокси

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const SECRET = process.env.JWT_SECRET;

// Регистрируем пользователя
app.post('/auth/register', async (req, res) => {
  const { first_name, second_name, nickname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const created_at = new Date();

  try {
    const result = await pool.query(
      "INSERT INTO users (first_name, second_name, nickname, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, second_name, nickname, email, hashedPassword, created_at]
    );
    res.status(201).json({ message: "User registered", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Логин пользователя
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'Unknown IP';

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Информация о платформе и браузере
    const platform = req.useragent ? req.useragent.platform : 'Unknown platform';
    const browser = req.useragent ? req.useragent.browser : 'Unknown browser';
    console.log('User logged in from platform:', platform, 'and browser:', browser, 'IP Address:', ipAddress);

    // Генерация JWT токена
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

    // Устанавливаем token в cookies
    res.cookie('token', token, {
      httpOnly: true,  // Токен доступен только серверу
      secure: process.env.NODE_ENV === 'production',  // Работает только для HTTPS в production
      sameSite: 'Strict',  // Предотвращает CSRF атаки
      maxAge: 3600 * 1000,  // Время жизни cookie (1 час)
    });

    // Отправляем успешный ответ
    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Проверка аутентификации
app.get('/auth/check', (req, res) => {
  const token = req.cookies.token;  // Получаем токен из cookies

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Пытаемся декодировать токен
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json({ user: decoded });  // Возвращаем данные пользователя
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Логаут пользователя
app.post('/auth/logout', (req, res) => {
  // Удаляем токен из cookies
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Работает только в production с HTTPS
    sameSite: 'Strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
