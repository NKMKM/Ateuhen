import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthProvider, useAuth } from "./AuthContext";
import RegisterForm from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import InfoPage from "./info_pages/Home";
import Premium from "./info_pages/Premium";
import NotFound from "./info_pages/NotFound";
import ChatPage from "./pages/ChatPage";
import AboutUs from "./info_pages/AboutUs";
import TestPage from "./test_pages/TestPage";
import Lobby from "./pages/Lobby";
import SettingsPage from "./pages/SettingsPage";
import Scrollbar from "./components/ScrollBar";
import ProfilePage from "./pages/ProfilePage";
import Loading from "./components/Loading";

function App() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/check", { withCredentials: true });
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

  if (loading) return <Loading loading={loading} />;

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* NonAuthorized pages */}
          <Route path="/" element={user ? <Navigate to="/home" /> : <InfoPage />} />
          <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterForm setUser={setUser} />} />
          <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage setUser={setUser} />} />

          {/* Authorized pages */}
          <Route path="/home" element={user ? <HomePage user={user} setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/chat" element={user ? <ChatPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/user/:nickname" element={<ProfilePage user={user} />} />

          {/* Other pages */}
          <Route path="/premium" element={<Premium />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/test_page" element={<TestPage />} />
          <Route path="/scrollbar" element={<Scrollbar />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;