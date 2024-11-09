import React, { useState, useEffect } from 'react';
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { FaFolder } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileUpload from "./FileUpload";  // Импортируем компонент для загрузки файлов

const MainScreen = () => {
    const [directories, setDirectories] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedDirectory, setSelectedDirectory] = useState(null);
    const [showUpload, setShowUpload] = useState(false);  // Для отображения/скрытия формы загрузки файлов
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDirectoriesAndFiles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const dirResponse = await axios.get('http://127.0.0.1:8000/api/v1/app/directories/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDirectories(dirResponse.data);

                const fileResponse = await axios.get('http://127.0.0.1:8000/api/v1/app/files/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFiles(fileResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                } else {
                    console.error('Ошибка при загрузке данных:', error);
                }
            }
        };

        fetchDirectoriesAndFiles();
    }, [navigate]);

    const handleDirectoryClick = (directory) => {
        setSelectedDirectory(directory === selectedDirectory ? null : directory);
    };

    const rootDirectories = directories.filter(directory => directory.parent_directory === null);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
            <Header />

            <main className="flex-grow p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">Мои папки</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {rootDirectories.map((directory, index) => (
                        <div key={index} className="text-center">
                            <button
                                onClick={() => handleDirectoryClick(directory)}
                                className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:bg-purple-100 transition-transform duration-200 transform ${
                                    selectedDirectory === directory ? 'scale-105 border-2 border-purple-500' : 'scale-100'
                                }`}
                            >
                                <FaFolder className="text-6xl text-purple-600 mb-2" />
                                <span className="text-lg font-semibold text-gray-800">{directory.name}</span>
                            </button>

                            {selectedDirectory === directory && (
                                <div className="mt-4 text-left p-4 bg-white rounded-lg shadow-lg border border-purple-200">
                                    <h3 className="font-bold text-lg text-purple-700 mb-4">Содержимое:</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        {files
                                            .filter(file => file.directory === directory.id)
                                            .map((file, idx) => (
                                                <li key={idx} className="text-gray-700">
                                                    <a href={`http://127.0.0.1:3000/directories/${directory.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {file.name}
                                                    </a> - {file.file_size} байт
                                                </li>
                                            ))}
                                    </ul>
                                    {/* Кнопка для отображения формы загрузки файлов */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setShowUpload(!showUpload)}
                                            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition duration-200"
                                        >
                                            {showUpload ? 'Скрыть форму загрузки' : 'Загрузить файл'}
                                        </button>
                                        {/* Компонент для загрузки файлов */}
                                        {showUpload && <FileUpload directoryId={directory.id} />}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainScreen;
