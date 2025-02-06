import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import RegisterForm from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InfoPage from './info_pages/Home';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/check', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/* "/" - сделанно, по исправлениям, убрать стрелочки слайдера(Sanyaaaa), добавить линк к некоторым кнопкам(N0ks1_) */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <InfoPage />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterForm setUser={setUser} />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage setUser={setUser} />} />
        <Route path="/home" element={user ? <HomePage user={user} setUser={setUser} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

//test siski