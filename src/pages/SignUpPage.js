import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = ({ setUser }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Текущий шаг формы
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNextStep = () => {
    if (step === 1 && (!firstName || !secondName || !email)) {
      alert("Please fill in all fields.");
      return;
    }
    if (step === 2 && !nickname) {
      alert("Please enter a nickname.");
      return;
    }
    setStep(step + 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Регистрируем пользователя
      const registerResponse = await axios.post(
        "http://localhost:5000/auth/register",
        { first_name: firstName, second_name: secondName, email, nickname, password },
        { withCredentials: true }
      );

      if (registerResponse.status === 201) {
        // Если регистрация успешна, сразу логиним пользователя
        const loginResponse = await axios.post(
          "http://localhost:5000/auth/login",
          { email, password },
          { withCredentials: true }
        );

        if (loginResponse.status === 200) {
          setUser(loginResponse.data.user); // Обновляем состояние пользователя
          navigate("/home"); // Перенаправляем на Home
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred during registration.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Second Name"
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="button" onClick={handleNextStep}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <button type="button" onClick={handleNextStep}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
