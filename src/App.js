import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import HomePage from './pages/Home';
import NotFound from './info_pages/NotFound';
import MainPage from './info_pages/Home';
import Footer from './info_pages/page_components/Footer'

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
};

const RedirectIfAuthenticated = ({ component }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  return user ? <Navigate to="/home" /> : component;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated component={<LoginPage />} />} />
          <Route path="/signup" element={<RedirectIfAuthenticated component={<SignupPage />} />} />
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
        <Footer/>
      </Router>
    </AuthProvider>
  );
};

export default App;
