import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/password-reset/', { email });
            setMessage(response.data.detail);
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Что-то пошло не так.');
            setMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 animate-gradient">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg bg-opacity-80">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Восстановление пароля</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border-b border-gray-300 py-2">
                        <MdEmail className="text-gray-500 mr-2" />
                        <input
                            type="email"
                            id="email"
                            placeholder="Введите ваш email"
                            className="w-full px-2 py-1 focus:outline-none text-gray-700 bg-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {message && <p className="text-green-500 text-center">{message}</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
                    >
                        Отправить ссылку для восстановления
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
