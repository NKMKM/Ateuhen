import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/check', { withCredentials: true });
        setUser(response.data.user); 
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (formData) => {
    const response = await axios.post('http://localhost:5000/auth/login', formData, { withCredentials: true });
    setUser(response.data.user); 
  };

  const logout = async () => {
    await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
