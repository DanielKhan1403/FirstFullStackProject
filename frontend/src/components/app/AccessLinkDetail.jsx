import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Footer from "../ui/Footer";
import Header from "../ui/Header";

const AccessLinkDetails = () => {
    const { linkId } = useParams();
    const [accessLink, setAccessLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!linkId) return;

        const fetchAccessLink = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/app/access-links/${linkId}/`);
                setAccessLink(response.data);
            } catch (error) {
                setError('Ошибка при загрузке данных о доступе.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccessLink();
    }, [linkId]);

    if (loading) {
        return <div className="text-center text-gray-500">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!accessLink) {
        return <div className="text-center text-gray-500">Ссылка доступа не найдена</div>;
    }


    if (!accessLink.directory) {
        return <div className="text-center text-gray-500">Каталог не найден</div>;
    }

    return (
        <>
            <Header />
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen py-8">
                <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Детали ссылки доступа</h2>

                    {/* Catalog Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Каталог</h3>
                        <p className="text-gray-700">Имя: {accessLink.directory.name || 'Неизвестный каталог'}</p>
                        <p className="text-gray-700">
                            Дата истечения: {new Date(accessLink.expiration_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">Тип токена: {accessLink.token_type}</p>
                    </div>

                    {/* Files Section */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Файлы в каталоге</h3>
                        {accessLink.directory.files?.length === 0 ? (
                            <p className="text-gray-600">Нет файлов в этом каталоге.</p>
                        ) : (
                            <ul className="space-y-4">
                                {accessLink.directory.files.map((file) => (
                                    <li key={file.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                        <p className="font-semibold text-gray-800">{file.name}</p>
                                        <a
                                            href={file.file}
                                            className="text-blue-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Скачать
                                        </a>
                                        <p className="text-gray-500">
                                            Создано: {new Date(file.created_at).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AccessLinkDetails;
