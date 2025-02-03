import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;
