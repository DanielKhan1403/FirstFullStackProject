import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../ui/Footer";
import Header from "../ui/Header";

const CreateAccessLink = () => {
    const [directories, setDirectories] = useState([]); // Состояние для хранения директорий
    const [selectedDirectory, setSelectedDirectory] = useState(""); // Состояние для выбранной директории
    const [tokenType, setTokenType] = useState("view"); // Состояние для типа токена
    const [expirationDate, setExpirationDate] = useState(""); // Состояние для даты истечения
    const [loading, setLoading] = useState(false); // Состояние для отображения процесса загрузки
    const [error, setError] = useState(null); // Состояние для ошибки
    const [linkCreated, setLinkCreated] = useState(null); // Состояние для отображения созданной ссылки

    // Запрос для получения списка директорий
    useEffect(() => {
        const fetchDirectories = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/v1/app/directories/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Добавляем токен
                    },
                });
                setDirectories(response.data);
            } catch (error) {
                console.error("Error fetching directories:", error);
                setError("Error fetching directories");
            }
        };

        fetchDirectories();
    }, []);

    const handleCreateAccessLink = async () => {

        console.log('DANYA')
        if (!selectedDirectory) {
            setError("Please select a directory");
            return;
        }


        if (!tokenType) {
            setError("Please select a token type");
            return;
        }


        if (!expirationDate) {
            setError("Please select an expiration date");
            return;
        }

        const data = {
            directory_id: selectedDirectory,
            token_type: tokenType,
            expiration_date: expirationDate,
        };
        console.log(data);
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/app/access-links/",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("Access link created:", response.data);
            setLinkCreated(response.data);
        } catch (error) {

            if (error.response) {
                setError(`Error: ${error.response.data.detail || error.response.data}`);
                console.error("Error creating access link:", error.response.data);
            } else {
                setError(`Error: ${error.message}`);
                console.error("Error creating access link:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header/>

        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 min-h-screen py-8">


            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 space-y-6">
                {/* Header */}
                <header className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-800">Create Access Link</h2>
                    <p className="text-lg text-gray-600 mt-2">Generate secure access links with customizable expiration and permissions.</p>
                </header>

                {/* Список директорий */}
                <div>
                    <label htmlFor="directory" className="block text-sm font-medium text-gray-700">
                        Select Directory
                    </label>
                    <select
                        id="directory"
                        value={selectedDirectory}
                        onChange={(e) => {console.log(e.target.value); setSelectedDirectory(e.target.value)}}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select a directory</option>
                        {directories.map((directory) => (
                            <option key={directory.id} value={directory.id}>
                                {directory.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Тип токена */}
                <div>
                    <label htmlFor="tokenType" className="block text-sm font-medium text-gray-700">
                        Token Type
                    </label>
                    <select
                        id="tokenType"
                        value={tokenType}
                        onChange={(e) => setTokenType(e.target.value)}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="view">view</option>
                        <option value="edit">edit</option>
                    </select>
                </div>

                {/* Дата истечения токена */}
                <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                        Expiration Date
                    </label>
                    <input
                        type="datetime-local"
                        id="expirationDate"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Кнопка для создания ссылки */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleCreateAccessLink}
                        disabled={loading}
                        className="inline-block px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {loading ? "Creating..." : "Create Link"}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                {/* Отображение созданной ссылки */}
                {linkCreated && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-md">
                        <p className="text-sm font-medium text-green-700">Access Link Created:</p>
                        <pre className="text-sm text-green-600">{JSON.stringify(linkCreated, null, 2)}</pre>
                        <p className="mt-2 text-green-700">
                            Access link URL:{" "}
                            <a href={linkCreated.frontend_url} target="_blank" rel="noopener noreferrer">
                                {linkCreated.frontend_url}
                            </a>
                        </p>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
        </>
    );
};

export default CreateAccessLink;
