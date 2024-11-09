import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ directoryId }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');  // Для имени файла или другого параметра
    const [isPublic, setIsPublic] = useState(true);  // Для публичности
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Обработчик для выбора файла
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Обработчик для отправки данных
    const onFileUpload = async () => {
        if (!file || !name) {
            setError('Please provide both file and name.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', directoryId); // Передаем ID директории
        formData.append('name', name);  // Передаем имя
        formData.append('is_public', isPublic);  // Передаем статус публичности

        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/app/upload/',  // URL вашего API
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setSuccess('File uploaded successfully');
            setFile(null);
            setName('');  // Сбросим поле для имени
            setIsPublic(false);  // Сбросим статус публичности
        } catch (err) {
            setError('Error uploading file');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={onFileChange}
                className="mb-4"
            />
            <input
                type="text"
                placeholder="Enter file name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            <div className="mb-4">
                <label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Public
                </label>
            </div>
            <button
                onClick={onFileUpload}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={uploading}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {error && <div className="mt-4 text-red-500">{error}</div>}
            {success && <div className="mt-4 text-green-500">{success}</div>}
        </div>
    );
};

export default FileUpload;
