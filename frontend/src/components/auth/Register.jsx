import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaCalendarAlt, FaLock } from 'react-icons/fa';
import '../ui/Header.css'

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:8000/api/v1/auth/register/", {
                username,
                email,
                date_of_birth: dateOfBirth,
                password,
            });
            setSuccess("Регистрация прошла успешно! Пожалуйста, подтвердите вашу почту! :)");

            localStorage.setItem('email', email);
            navigate("/verify-code");
        } catch (error) {
            setError("Что-то пошло не так, попробуйте еще раз! :(");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 animate-gradient">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg bg-opacity-75">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Регистрация</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border-b border-gray-300 py-2">
                        <FaUser className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Имя пользователя"
                            className="w-full px-2 py-1 focus:outline-none text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center border-b border-gray-300 py-2">
                        <FaEnvelope className="text-gray-500 mr-2" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-2 py-1 focus:outline-none text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center border-b border-gray-300 py-2">
                        <FaCalendarAlt className="text-gray-500 mr-2" />
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full px-2 py-1 focus:outline-none text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center border-b border-gray-300 py-2">
                        <FaLock className="text-gray-500 mr-2" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            className="w-full px-2 py-1 focus:outline-none text-gray-700 bg-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
                    >
                        Зарегистрироваться
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-blue-500 hover:underline"
                    >
                        Есть аккаунт? Войти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
