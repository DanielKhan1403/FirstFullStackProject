import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLink, FaUser, FaSignOutAlt, FaSignInAlt, FaFolder, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const Header = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [directories, setDirectories] = useState([]);

    // Retrieve username from localStorage
    const username = localStorage.getItem('username');

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Creating a new directory
    const handleCreateDirectory = async () => {
        const token = localStorage.getItem('token');
        const directoryName = prompt('Enter the directory name:');
        if (!directoryName) return;

        const data = {
            name: directoryName,
            is_public: true,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/app/directories/', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDirectories([...directories, response.data]);
            alert('Directory created successfully');
        } catch (error) {
            console.error('Error creating directory:', error);
        }
    };

    // Fetching directories on component mount
    useEffect(() => {
        const fetchDirectories = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/app/directories/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDirectories(response.data);
            } catch (error) {
                console.error('Error fetching directories:', error);
            }
        };

        fetchDirectories();
    }, []);

    return (
        <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
            <Link to="/dashboard" className="text-2xl font-bold hover:text-gray-200 transition-colors duration-300">
                DustBase
            </Link>
            <div className="relative">
                <button
                    onClick={handleMenuToggle}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors duration-300"
                >
                    <FaFolder className="mr-2" />
                    <span>Manage</span>
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                        <button
                            onClick={handleCreateDirectory}
                            className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center transition-colors duration-200"
                        >
                            <FaPlus className="mr-2" />
                            Create Directory
                        </button>
                    </div>
                )}
            </div>
            <div className="flex space-x-4">
                {isAuthenticated && (
                    <div className="text-white">
                        <span>Hello, {username}</span>
                    </div>
                )}
                {isAuthenticated && (
                    <Link
                        to="/profile"
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md flex items-center transition-colors duration-300"
                    >
                        <FaUser className="mr-2" />
                        Profile
                    </Link>
                )}
                {isAuthenticated && (
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md flex items-center transition-colors duration-300"
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </Link>
                )}
                {!isAuthenticated && (
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md flex items-center transition-colors duration-300"
                    >
                        <FaSignInAlt className="mr-2" />
                        Login
                    </Link>
                )}
            </div>

            {/* Button to open the access link creation page */}
            <Link
                to="/create-access-link"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md flex items-center ml-4 transition-colors duration-300"
            >
                <FaLink className="mr-2" />
                Create Access Link
            </Link>
        </div>
    );
};

export default Header;
