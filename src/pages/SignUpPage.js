import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import BackButton from '../components/BackButton';
import Terms from '../components/Terms';
import './SignUpPage.css';
import axios from 'axios';

const SignUpPage = () => {
  /* условно поменяй че хочешь, один хуй фиксить надо*/
  const [borderColor, setBorderColor] = useState('rgba(255, 255, 255, 0.5)');
  const [error, setError] = useState('');  

  const handleMouseMove = () => {
    setBorderColor('rgba(255, 255, 255, 1)');
  };

  const handleMouseLeave = () => {
    setBorderColor('rgba(255, 255, 255, 0.5)');
  };

  
  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/signup', formData);
      console.log(response.data);  
      
    } catch (error) {
      console.error(error.response.data);
      setError(error.response.data.message);  
    }
  };

  return (
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
          <h1>Sign up</h1>
          <p>
            You already have an account? <Link to="/">Log In!</Link>
          </p>
          <RegisterForm onSubmit={handleSubmit} />
          {error && <p style={{ color: 'red' }}>{error}</p>}  
          <Terms />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
