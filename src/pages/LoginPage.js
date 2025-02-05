import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import { useAuth } from './context/AuthContext';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        setLoading(true); 
        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                console.log('Login successful:', data); 
                localStorage.setItem("token", data.token); 
                login(data); 
                navigate("/home"); 
            } else {
                alert(data.error); 
            }
        } catch (error) {
            alert("Ошибка при подключении к серверу");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div>
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
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Loading..." : "Login"}
            </button>
        </div>
    );
};

export default LoginForm;
