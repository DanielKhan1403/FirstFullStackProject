import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { user_id, token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/auth/reset-password/${user_id}/${token}/`,
                { password: newPassword }
            );
            setMessage(response.data.message);
            setError('');
            setNewPassword('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Что-то пошло не так.');
            setMessage('');
        }
    };

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                await axios.get(`http://localhost:8000/api/v1/auth/reset-password/${user_id}/${token}/`);
            } catch (err) {
                setError('Неверный или истёкший токен.');
            }
        };

        checkTokenValidity();
    }, [user_id, token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 animate-gradient">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg bg-opacity-80">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Сброс пароля</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-gray-600">Новый пароль</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Введите новый пароль"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && <p className="text-green-500 text-center">{message}</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
                    >
                        Сбросить пароль
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
