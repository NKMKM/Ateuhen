import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom"; // Для перенаправления

const socket = io("http://localhost:5000", { withCredentials: true });

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]); // Список сессий
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(""); // Ошибки
  const [currentSessionId, setCurrentSessionId] = useState(null); // ID текущей сессии
  const navigate = useNavigate(); // Хук для перенаправления

  // Загружаем сессии пользователя
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        console.log("Загрузка сессий...");

        // Проверяем, есть ли токен в куках
        const currentToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        console.log("Токен из куки:", currentToken);

        if (!currentToken) {
          console.log("Токен отсутствует. Перенаправление на страницу входа.");
          navigate("/login");
          return;
        }

        // Загружаем сессии
        const res = await axios.get("http://localhost:5000/auth/sessions", { withCredentials: true });
        console.log("Сессии получены:", res.data);

        setSessions(res.data);

        // Определяем текущую сессию пользователя
        const currentSession = res.data.find((session) => session.token === currentToken);
        console.log("Текущая сессия:", currentSession);

        if (currentSession) {
          setCurrentSessionId(currentSession.id);
          console.log("Текущая сессия определена:", currentSession.id);
        } else {
          console.log("Текущая сессия не найдена.");
        }
      } catch (err) {
        console.error("Ошибка загрузки сессий:", err);
        setError("Ошибка загрузки сессий");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  // Удаление сессии
  const handleDeleteSession = async (sessionId) => {
    try {
      console.log("Удаление сессии с ID:", sessionId);

      const res = await axios.delete(`http://localhost:5000/auth/sessions/${sessionId}`, {
        withCredentials: true,
      });

      console.log("Ответ сервера при удалении сессии:", res.data);

      if (res.data.message === "Session deleted. You have been logged out.") {
        console.log("Текущая сессия удалена. Удаление токена из куки.");

        // Удаляем токен из кэша (куки)
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Перенаправляем на страницу входа
        navigate("/login");
      } else {
        console.log("Сессия удалена. Обновление списка сессий.");

        // Обновляем список сессий
        setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      }
    } catch (err) {
      console.error("Ошибка удаления сессии:", err);
      alert("Не удалось удалить сессию");
    }
  };

  // Обработка уведомления о выходе через WebSocket
  useEffect(() => {
    socket.on("forceLogout", (userId) => {
      console.log("Получено уведомление о выходе для пользователя:", userId);

      // Проверяем, что это текущий пользователь
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      console.log("Текущий пользователь из localStorage:", currentUser);

      if (currentUser && currentUser.id === userId) {
        console.log("Пользователь совпадает. Удаление данных и перенаправление.");

        // Удаляем данные пользователя и перенаправляем на страницу входа
        localStorage.removeItem("currentUser");
        navigate("/login");
      }
    });

    return () => {
      socket.off("forceLogout");
    };
  }, [navigate]);

  // Обработка уведомления об обновлении списка сессий
  useEffect(() => {
    socket.on("sessionUpdated", (updatedSessions) => {
      console.log("Получено уведомление об обновлении сессий:", updatedSessions);
      setSessions(updatedSessions);
    });

    return () => {
      socket.off("sessionUpdated");
    };
  }, []);

  // Определяем тип устройства (PC или Phone)
  const getDeviceType = (device) => {
    if (device.toLowerCase().includes("windows") || device.toLowerCase().includes("mac")) {
      return "This PC";
    } else if (device.toLowerCase().includes("iphone") || device.toLowerCase().includes("android")) {
      return "This Phone";
    } else {
      return device; // Если тип устройства неизвестен, возвращаем как есть
    }
  };

  if (isLoading) {
    return <div className="p-4">Загрузка...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Активные сессии</h1>
      <ul>
        {sessions.map((session) => (
          <li key={session.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <p>Устройство: {getDeviceType(session.device)}</p>
              <p>Браузер: {session.browser}</p>
              <p>IP: {session.ip_address}</p>
              <p>Время входа: {new Date(session.login_time).toLocaleString()}</p>
              {session.id === currentSessionId && (
                <p className="text-green-500">Текущая сессия</p>
              )}
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDeleteSession(session.id)}
              disabled={session.id === currentSessionId} // Запрещаем удаление текущей сессии
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionsPage;