import React, { useState, useEffect,useContext } from 'react';
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
import ChatPage from './pages/ChatPage';
import AboutUs from './info_pages/AboutUs'
import TestPage from './test_pages/TestPage';
import Lobby from './pages/Lobby';
import Test from './pages/TestPage';
function App() {
  
  const [user, setUser] = useState(undefined); 
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/check', { withCredentials: true });
        console.log("✅ User loaded:", response.data.user);
        setUser(response.data.user || null);
      } catch (error) {
        console.error("❌ Error loading user:", error);
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
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/test_page" element={<TestPage/>} />
        <Route path="/testcard" element={<TestCard/>} />
        <Route path="/settings" element={<Test/>} />
        <Route path="/chat" element={user ? <ChatPage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>


  );
}

export default App;


{/* <Router>
<Routes>
  <Route path="/" element={user ? <Navigate to="/home" /> : <InfoPage />} />
  <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterForm setUser={setUser} />} />
  <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage setUser={setUser} />} />
  <Route path="/home" element={user ? <HomePage user={user} setUser={setUser} /> : <Navigate to="/" />} />
  <Route path="/sessions" element={user ? <SessionsPage setUser={setUser} /> : <Navigate to="/login" />} />
  <Route path="/premium" element={<Premium />} />
  <Route path="/about_us" element={<AboutUs />} />
  <Route path="/*" element={<NotFound />} />
  <Route path="/test_page" element={<TestPage/>} />
  <Route path="/testcard" element={<TestCard/>} />
  <Route path="/chat" element={user ? <ChatPage user={user} /> : <Navigate to="/login" />} />
</Routes>
</Router> */}