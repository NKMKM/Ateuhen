import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { withCredentials: true });

export default function ChatApp() {
  const [userCode, setUserCode] = useState(""); // Код текущего пользователя
  const [nickname, setNickname] = useState(""); // Никнейм друга
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserName();
    fetchFriends();
    fetchRequests();

    socket.on("receiveMessage", (data) => {
      if (data.sender === currentFriend) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on("friendRequestReceived", (data) => {
      setRequests((prev) => [...prev, data]);
    });

    fetchMessages();

    return () => {
      socket.off("receiveMessage");
      socket.off("friendRequestReceived");
    };
  }, [currentFriend]);

  // Получение кода текущего пользователя
  const fetchUserName = async () => {
    const res = await fetch("http://localhost:5000/user/nickname", { credentials: "include" });
    const data = await res.json();
    setUserCode(data.code);
  };

  const fetchFriends = async () => {
    const res = await fetch("http://localhost:5000/friends/list", { credentials: "include" });
    const data = await res.json();
    setFriends(data);
  };

  const fetchRequests = async () => {
    const res = await fetch("http://localhost:5000/friends/requests", { credentials: "include" });
    const data = await res.json();
    setRequests(data);
  };

  const fetchMessages = async () => {
    if (!currentFriend) return;
    const res = await fetch(`http://localhost:5000/messages/${currentFriend}`, { credentials: "include" });
    const data = await res.json();
    setMessages(data);
  };

  // Отправка запроса в друзья по никнейму
  const sendFriendRequest = async () => {
    await fetch("http://localhost:5000/friends/add", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    setNickname("");
  };

  const acceptRequest = async (sender) => {
    await fetch("http://localhost:5000/friends/accept", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender }),
    });
    fetchFriends();
    fetchRequests();
  };

  const sendMessage = async () => {
    if (!currentFriend || message.trim() === "") return;
    socket.emit("sendMessage", { receiver: currentFriend, message });
    setMessages((prev) => [...prev, { sender: "You", message }]);
    setMessage("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold">Твой код:</h2>
      <div className="p-2 border bg-gray-100 rounded">{userCode}</div>

      <h2 className="text-xl font-bold mt-4">Добавить друга</h2>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Введите никнейм друга"
        className="w-full px-3 py-2 border rounded"
      />
      <button onClick={sendFriendRequest} className="px-4 py-2 bg-blue-500 text-white rounded">
        Отправить запрос
      </button>

      <h2 className="text-xl font-bold mt-4">Запросы в друзья</h2>
      {requests.map((req) => (
        <div key={req.id} className="flex justify-between p-2 border">
          <span>{req.sender_nickname}</span>
          <button onClick={() => acceptRequest(req.sender_nickname)} className="px-3 py-1 bg-green-500 text-white rounded">
            Принять
          </button>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-4">Друзья</h2>
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="p-2 border cursor-pointer hover:bg-gray-200 transition"
          onClick={() => setCurrentFriend(friend.nickname)}
        >
          {friend.nickname}
        </div>
      ))}

      {currentFriend && (
        <>
          <h2 className="text-xl font-bold mt-4">Чат с {currentFriend}</h2>
          <div className="h-60 overflow-y-auto border p-2">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение"
            className="w-full px-3 py-2 border rounded"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
            Отправить
          </button>
        </>
      )}
    </div>
  );
}
