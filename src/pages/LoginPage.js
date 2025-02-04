import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import { useAuth } from './context/AuthContext'; // Импортируйте useAuth для использования контекста

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const navigate = useNavigate();
    const { login } = useAuth(); // Получаем login из контекста

    const handleLogin = async () => {
        setLoading(true); // Запускаем индикатор загрузки
        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                console.log('Login successful:', data); // Логируем данные после успешного входа
                localStorage.setItem("token", data.token); // Сохраняем токен в localStorage
                login(data); // Обновляем контекст
                navigate("/home"); // Перенаправляем на страницу home
            } else {
                alert(data.error); // Если ошибка, показываем сообщение
            }
        } catch (error) {
            alert("Ошибка при подключении к серверу");
        } finally {
            setLoading(false); // Завершаем загрузку
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
