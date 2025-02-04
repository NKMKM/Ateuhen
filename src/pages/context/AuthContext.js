import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Состояние для пользователя
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

  // Проверяем аутентификацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/check', {
          withCredentials: true // Убедитесь, что cookies передаются с запросом
        });
        setUser(response.data.user); // Устанавливаем пользователя в состояние
      } catch (error) {
        console.error('Ошибка при проверке аутентификации', error);
        setUser(null); // Если ошибка, очищаем пользователя
      }
      setIsLoading(false); // Завершаем процесс загрузки
    };

    checkAuth();
  }, []); // useEffect с пустым массивом, чтобы выполнить один раз при монтировании компонента

  const login = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', formData, {
        withCredentials: true, // Включаем cookies в запрос
      });
      setUser(response.data.user); // Обновляем пользователя
    } catch (error) {
      console.error('Ошибка при логине', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, {
        withCredentials: true, // Включаем cookies в запрос
      });
      setUser(null); // Убираем пользователя
    } catch (error) {
      console.error('Ошибка при логауте', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
