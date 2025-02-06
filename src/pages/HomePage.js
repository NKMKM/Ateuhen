import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage({ user, setUser }) {
  const navigate = useNavigate();

  // Функция для логаута
  const handleLogout = async () => {
    try {
      // Отправляем запрос на сервер для очистки cookies (выход)
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      
      // Обновляем состояние в React, чтобы удалить данные пользователя
      setUser(null);
      
      // Перенаправляем на страницу входа
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Welcome, {user.email}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;
