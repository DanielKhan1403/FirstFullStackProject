import React from 'react';
import { FaGithub, FaInstagram, FaTelegramPlane, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6">
            <div className="flex justify-center space-x-8">
                <a
                    href="https://github.com/DanielKhan1403"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-200 transition-transform duration-300 transform hover:scale-110"
                >
                    <FaGithub className="text-3xl" />
                </a>

                <a
                    href="https://www.instagram.com/khddflux/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-200 transition-transform duration-300 transform hover:scale-110"
                >
                    <FaInstagram className="text-3xl" />
                </a>

                <a
                    href="https://t.me/DanielQo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-200 transition-transform duration-300 transform hover:scale-110"
                >
                    <FaTelegramPlane className="text-3xl" />
                </a>

                <a
                    href="https://www.linkedin.com/in/daniel-khanseverov-91430a302"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-200 transition-transform duration-300 transform hover:scale-110"
                >
                    <FaLinkedin className="text-3xl" />
                </a>
            </div>
            <div className="text-center text-sm mt-4 opacity-70">
                <p>&copy; 2024 Daniel Khanseverov. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
