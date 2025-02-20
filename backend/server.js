const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const useragent = require("express-useragent");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(useragent.express());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.set("trust proxy", true);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const SECRET = process.env.JWT_SECRET || "defaultsecret";

const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

    await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3)",
      [senderId, receiverId, message]
    );

    io.emit("receiveMessage", { senderId, receiverId, message });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 🔹 Регистрация пользователя
app.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const { first_name, second_name, email, nickname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const created_at = new Date();

    try {
      const userResult = await pool.query(
        "INSERT INTO users (first_name, second_name, email, nickname, password, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [first_name, second_name, email, nickname, hashedPassword, created_at]
      );

      const user = userResult.rows[0];

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

// 🔹 Авторизация пользователя
app.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ message: "Login successful", user });
  })
);

// 🔹 Проверка аутентификации
app.get(
  "/auth/check",
  asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const decoded = jwt.verify(token, SECRET);
      res.status(200).json({ user: decoded });
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  })
);

// 🔹 Выход из системы
app.post(
  "/auth/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  })
);

// 🔹 Добавление в друзья
app.post(
  "/friends/add",
  asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const { friendId } = req.body;
    const decoded = jwt.verify(token, SECRET);

    if (decoded.id === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend" });
    }

    try {
      await pool.query(
        "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)",
        [decoded.id, friendId]
      );
      res.json({ message: "Friend added" });
    } catch (err) {
      res.status(400).json({ error: "Already friends or invalid request" });
    }
  })
);

// 🔹 Список друзей
app.get(
  "/friends/list",
  asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, SECRET);
    const friends = await pool.query(
      `SELECT u.id, u.nickname FROM friends f 
       JOIN users u ON f.friend_id = u.id WHERE f.user_id = $1`,
      [decoded.id]
    );
    res.json(friends.rows);
  })
);
app.post('/friends/add', asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const { nickname } = req.body;
  const decoded = jwt.verify(token, SECRET);

  // Проверяем, не добавляет ли пользователь сам себя
  if (nickname === decoded.nickname) {
      return res.status(400).json({ message: "You cannot add yourself as a friend" });
  }

  // Находим ID пользователя по никнейму
  const friendResult = await pool.query("SELECT id FROM users WHERE nickname = $1", [nickname]);
  if (friendResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
  }
  const friendId = friendResult.rows[0].id;

  // Проверяем, не добавлены ли они уже в друзья
  const checkFriendship = await pool.query(
      "SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2",
      [decoded.id, friendId]
  );

  if (checkFriendship.rows.length > 0) {
      return res.status(400).json({ message: "Already friends" });
  }

  // Добавляем в друзья
  await pool.query(
      "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)",
      [decoded.id, friendId]
  );

  res.json({ message: "Friend added successfully" });
}));

// 🔹 Ошибки сервера
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// 🚀 Запуск сервера (Важно! `server.listen`, а не `app.listen`)
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
