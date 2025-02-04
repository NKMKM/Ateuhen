import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Terms from '../components/Terms';
import axios from 'axios';
import BackButton from '../components/BackButton';
import "../App.css";

const LoginPage = () => {
  
  /* Сюда закинь все функции которые будут связаны с паролем/email/и другие */

  const [borderColor, setBorderColor] = useState('rgba(255, 255, 255, 0.5)');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleMouseMove = () => setBorderColor('rgba(255, 255, 255, 1)');
  const handleMouseLeave = () => setBorderColor('rgba(255, 255, 255, 0.5)');

  const handleLogin = async (formData) => {
    setIsLoading(true); 
    setError(''); 
    try {
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      
      await axios.post(`${API_URL}/auth/login`, formData, {
        withCredentials: true, 
      });

      
      navigate('/home');
    } catch (err) {
      
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    /* Тут поиграйся по большей части с div'ами и попробуй не менять функции plaveholderov*/
    <div className="background">
      <div
        className="login-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          borderColor: borderColor,
        }}
      >
        <Link to="/">
          <BackButton />
        </Link>
        <div className="login-box">
          <div className="logo-placeholder"></div>
          <h1>Yooo, welcome back!</h1>
          <p>
            First time here? <Link to="/signup">Sign up for free</Link>
          </p>
          <LoginForm onSubmit={handleLogin} />
          {isLoading && <p>Loading...</p>} 
          {error && <p className="error-message">{error}</p>} 
          <Terms />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
