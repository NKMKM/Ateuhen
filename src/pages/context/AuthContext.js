import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/check', {
          withCredentials: true 
        });
        setUser(response.data.user); 
      } catch (error) {
        console.error('Ошибка при проверке аутентификации', error);
        setUser(null); 
      }
      setIsLoading(false); 
    };

    checkAuth();
  }, []); 

  const login = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', formData, {
        withCredentials: true,
      });
      setUser(response.data.user); 
    } catch (error) {
      console.error('Ошибка при логине', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, {
        withCredentials: true,
      });
      setUser(null); 
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
