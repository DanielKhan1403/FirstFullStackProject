import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
                username,
                password,
            });

            localStorage.setItem('token', response.data.access);
            localStorage.setItem('isAuthenticated', 'true');

            navigate('/dashboard');
        } catch (error) {
            setError('Ошибка входа. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate('/password-reset');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 animate-gradient">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg bg-opacity-75">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Вход</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
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
                        disabled={loading}
                        className="w-full bg-indigo-500 text-white py-2 rounded font-semibold hover:bg-indigo-600 transition"
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="mt-4 text-center space-y-2">
                    <button
                        onClick={handleForgotPassword}
                        className="text-indigo-500 hover:underline"
                    >
                        Забыли пароль?
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="text-indigo-500 hover:underline"
                    >
                        Нет аккаунта? Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
