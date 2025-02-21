import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { withCredentials: true });

const ChatPage = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Загружаем данные текущего пользователя
  // Загружаем данные текущего пользователя
useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/check", { withCredentials: true });
      if (res.data.user) {
        setCurrentUser(res.data.user);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user)); // Сохраняем данные
      } else {
        console.error("Пользователь не авторизован");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      window.location.href = "/login";
    }
  };

  // Проверяем, есть ли данные в localStorage
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    setCurrentUser(JSON.parse(savedUser));
  } else {
    fetchCurrentUser();
  }
}, []);

  // Загружаем друзей и заявки в друзья
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsRes = await axios.get("http://localhost:5000/friends/list", { withCredentials: true });
        setFriends(friendsRes.data);
  
        const requestsRes = await axios.get("http://localhost:5000/friends/requests", { withCredentials: true });
        setFriendRequests(requestsRes.data);
      } catch (error) {
        console.error("Ошибка загрузки друзей/заявок:", error);
      }
    };
  
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Поиск друзей по никнейму
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/friends/search?nickname=${searchTerm}`, { withCredentials: true });
        setSearchResults(res.data);
      } catch (error) {
        console.error("Ошибка поиска друзей:", error);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  // Загружаем сообщения при выборе чата
  useEffect(() => {
    if (selectedChat) {
      axios.get(`http://localhost:5000/chat/messages?receiverId=${selectedChat.id}`, { withCredentials: true })
        .then((res) => setMessages(res.data))
        .catch((err) => {
          console.error("Ошибка загрузки сообщений:", err);
          alert("Не удалось загрузить сообщения");
        });
    }
  }, [selectedChat]);
  // Обработка новых сообщений из WebSocket
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      const isMessageExists = messages.some((msg) => msg.id === message.id);
      if (!isMessageExists) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [messages, selectedChat]);

  // Отправка сообщения
  const sendMessage = () => {
    if (messageInput.trim() && selectedChat && currentUser) {
      socket.emit("sendMessage", {
        senderId: currentUser.id,
        receiverId: selectedChat.id,
        message: messageInput,
      });

      setMessageInput("");
    }
  };

  // Отправка запроса в друзья
  const sendFriendRequest = async (receiverId) => {
    if (!currentUser || !currentUser.id || !receiverId) {
      alert("Недостаточно данных для отправки запроса");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/friends/request",
        { senderId: currentUser.id, receiverId },
        { withCredentials: true }
      );
      alert("Запрос в друзья отправлен");
    } catch (error) {
      console.error("Ошибка отправки запроса в друзья:", error);
      alert("Не удалось отправить запрос в друзья");
    }
  };

  // Принять заявку в друзья
  const handleAcceptRequest = async (senderId) => {
    if (!currentUser || !currentUser.id || !senderId) {
      alert("Недостаточно данных для обработки заявки");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/friends/accept",
        { senderId },
        { withCredentials: true }
      );
      alert("Заявка в друзья принята");
      // Обновляем список заявок
      const requestsRes = await axios.get("http://localhost:5000/friends/requests", { withCredentials: true });
      setFriendRequests(requestsRes.data);
    } catch (error) {
      console.error("Ошибка при принятии заявки:", error);
      alert("Не удалось принять заявку");
    }
  };

  // Отклонить заявку в друзья
  const handleRejectRequest = async (senderId) => {
    if (!currentUser || !currentUser.id || !senderId) {
      alert("Недостаточно данных для обработки заявки");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/friends/reject",
        { senderId },
        { withCredentials: true }
      );
      alert("Заявка в друзья отклонена");
      // Обновляем список заявок
      const requestsRes = await axios.get("http://localhost:5000/friends/requests", { withCredentials: true });
      setFriendRequests(requestsRes.data);
    } catch (error) {
      console.error("Ошибка при отклонении заявки:", error);
      alert("Не удалось отклонить заявку");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Левая колонка (Друзья + Заявки + Поиск) */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-2">Друзья</h2>

        {/* 🔍 Поле для поиска */}
        <input
          type="text"
          className="w-full p-2 mb-2 border rounded"
          placeholder="🔍 Поиск по никнейму..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 🔍 Результаты поиска */}
        {searchResults.length > 0 && (
          <div className="bg-white p-2 border rounded mb-2">
            <h3 className="text-sm font-bold">Результаты поиска:</h3>
            <ul>
              {searchResults.map((user) => (
                <li key={user.id} className="p-2 border-b flex justify-between items-center">
                  <span>{user.nickname}</span>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => sendFriendRequest(user.id)}
                  >
                    Добавить
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Список друзей */}
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} className="p-2 border-b cursor-pointer hover:bg-gray-200" onClick={() => setSelectedChat(friend)}>
              {friend.nickname}
            </li>
          ))}
        </ul>

        {/* Заявки в друзья */}
        <h2 className="text-xl font-bold mt-4 mb-2">Заявки в друзья</h2>
        <ul>
          {friendRequests.map((req) => (
            <li key={req.id} className="p-2 border-b flex justify-between">
              <span>{req.nickname}</span>
              <div>
                <button
                  className="text-green-600 mr-2"
                  onClick={() => handleAcceptRequest(req.id)}
                >
                  ✔
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleRejectRequest(req.id)}
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Чат */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="bg-gray-200 p-4 text-lg font-bold border-b">{selectedChat.nickname}</div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded ${msg.sender_id === currentUser?.id ? "bg-blue-200 self-end" : "bg-gray-300 self-start"}`}>
                  <strong>{msg.sender_nickname}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Введите сообщение..."
              />
              <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                Отправить
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Выберите друга для начала чата
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;