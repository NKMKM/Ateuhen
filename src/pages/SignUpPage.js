import React, { useState } from "react";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          second_name: secondName,
          nickname,
          email,
          password,
        }),
      });

      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      alert("An error occurred during registration.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Second Name"
        value={secondName}
        onChange={(e) => setSecondName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterForm;
