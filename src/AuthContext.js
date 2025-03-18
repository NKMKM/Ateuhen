import React, { createContext, useContext, useState } from 'react';

// Создаем контекст
const AuthContext = createContext();

// Провайдер для контекста
function AuthProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(123); // Пример состояния

  return (
    <AuthContext.Provider value={{ currentUserId, setCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста
function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };