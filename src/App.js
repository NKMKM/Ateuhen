import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import RegisterForm from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InfoPage from './info_pages/Home';
import Premium from './info_pages/Premium';
import NotFound from './info_pages/NotFound';
import SessionsPage from './test_pages/SessionPage';
import TestCard from './pages/TestCard';

function App() {
  const [user, setUser] = useState(undefined); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/check', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; 

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <InfoPage />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterForm setUser={setUser} />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage setUser={setUser} />} />
        <Route path="/home" element={user ? <HomePage user={user} setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/sessions" element={user ? <SessionsPage setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/testcard" element={<TestCard />} />
      </Routes>
    </Router>
  );
}

export default App;
