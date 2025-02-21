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

// 🔹 WebSocket-соединение (Чат)
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      const senderRes = await pool.query("SELECT nickname FROM users WHERE id = $1", [senderId]);
      if (senderRes.rows.length === 0) return;

      const receiverRes = await pool.query("SELECT nickname FROM users WHERE id = $1", [receiverId]);
      if (receiverRes.rows.length === 0) return;

      const senderNickname = senderRes.rows[0].nickname;
      const receiverNickname = receiverRes.rows[0].nickname;

      const messageRes = await pool.query(
        "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING id",
        [senderId, receiverId, message]
      );

      const messageId = messageRes.rows[0].id;

      io.emit("receiveMessage", {
        id: messageId,
        senderId,
        senderNickname,
        receiverId,
        receiverNickname,
        message,
      });
    } catch (error) {
      console.error("❌ Ошибка в WebSocket sendMessage:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 🔹 Регистрация пользователя
app.post("/auth/register", asyncHandler(async (req, res) => {
  const { first_name, second_name, email, nickname, password } = req.body;
  if (!first_name || !second_name || !email || !nickname || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userResult = await pool.query(
      "INSERT INTO users (first_name, second_name, email, nickname, password, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [first_name, second_name, email, nickname, hashedPassword]
    );

    const user = userResult.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}));

// 🔹 Авторизация пользователя
app.post("/auth/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

  const user = result.rows[0];
  if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });

  res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
  res.json({ message: "Login successful", user });
}));

// 🔹 Проверка аутентификации
app.get("/auth/check", asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}));

// 🔹 Выход из системы
app.post("/auth/logout", asyncHandler(async (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
  res.status(200).json({ message: "Logged out successfully" });
}));

// 🔹 Отправить заявку в друзья
app.post("/friends/request", asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Sender and receiver IDs are required" });
  }

  try {
    await pool.query("INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", 
      [senderId, receiverId]);
    res.json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Ошибка отправки запроса в друзья:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}));

// 🔹 Получить входящие заявки в друзья
app.get("/friends/requests", asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const decoded = jwt.verify(token, SECRET);
  const result = await pool.query(
    "SELECT users.id, users.nickname FROM friend_requests JOIN users ON friend_requests.sender_id = users.id WHERE friend_requests.receiver_id = $1",
    [decoded.id]
  );

  res.json(result.rows);
}));

// 🔹 Принять заявку в друзья
app.post("/friends/accept", asyncHandler(async (req, res) => {
  const { senderId } = req.body;
  if (!senderId) {
    return res.status(400).json({ error: "Sender ID is required" });
  }

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const decoded = jwt.verify(token, SECRET);
  const receiverId = decoded.id;

  await pool.query("DELETE FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2", [senderId, receiverId]);
  await pool.query("INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)", [senderId, receiverId]);

  res.json({ message: "Friend request accepted" });
}));

// 🔹 Отклонить заявку в друзья
app.post("/friends/reject", asyncHandler(async (req, res) => {
  const { senderId } = req.body;
  if (!senderId) {
    return res.status(400).json({ error: "Sender ID is required" });
  }

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const decoded = jwt.verify(token, SECRET);
  const receiverId = decoded.id;

  await pool.query("DELETE FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2", [senderId, receiverId]);

  res.json({ message: "Friend request rejected" });
}));

// 🔹 Получить список друзей
app.get("/friends/list", asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  const decoded = jwt.verify(token, SECRET);
  const result = await pool.query(
    "SELECT users.id, users.nickname FROM friends JOIN users ON friends.friend_id = users.id WHERE friends.user_id = $1",
    [decoded.id]
  );

  res.json(result.rows);
}));

// 🔹 Поиск друзей
app.get("/friends/search", asyncHandler(async (req, res) => {
  const { nickname } = req.query;
  if (!nickname) {
    return res.status(400).json({ error: "Nickname is required" });
  }

  try {
    const result = await pool.query("SELECT id, nickname FROM users WHERE nickname ILIKE $1", [`%${nickname}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка поиска друзей:", error);
    res.status(500).json({ error: "Server error" });
  }
}));

// 🔹 Загрузить сообщения
app.get("/chat/messages", asyncHandler(async (req, res) => {
  const { receiverId } = req.query;
  if (!receiverId) {
    return res.status(400).json({ error: "Receiver ID is required" });
  }

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const senderId = decoded.id;

    const result = await pool.query(
      `SELECT m.*, u1.nickname as sender_nickname, u2.nickname as receiver_nickname 
       FROM messages m
       JOIN users u1 ON m.sender_id = u1.id
       JOIN users u2 ON m.receiver_id = u2.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at`,
      [senderId, receiverId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка загрузки сообщений:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}));

// 🚀 Запуск сервера
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});