import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaRedo } from "react-icons/fa"; // Импорт иконок

function VerifyCode() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [timer, setTimer] = useState(60);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
            setEmail(savedEmail);
        }

        const countdown = setInterval(() => {
            if (timer > 0) {
                setTimer((prevTime) => prevTime - 1);
            } else {
                setIsResendEnabled(true);
                clearInterval(countdown);
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/v1/auth/verify-code/", { email, code });
            setSuccess("Account successfully verified!");
            navigate("/login");
        } catch (err) {
            setError("Invalid verification code.");
        }
    };

    const handleResendCode = async () => {
        try {
            await axios.post("http://localhost:8000/api/v1/auth/resend-code/", { email });
            setSuccess("Verification code has been resent!");
            setTimer(60);
            setIsResendEnabled(false);
        } catch (err) {
            setError("Something went wrong, try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Verify Your Email</h2>
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {success && <p className="text-green-600 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border-2 rounded-md p-2">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={email}
                            readOnly
                            placeholder="Email"
                            required
                            className="w-full focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center border-2 rounded-md p-2">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Verification Code"
                            required
                            className="w-full focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Verify Code
                    </button>
                </form>
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handleResendCode}
                        disabled={!isResendEnabled}
                        className={`flex items-center text-blue-600 ${!isResendEnabled ? 'cursor-not-allowed' : ''}`}
                    >
                        <FaRedo className="mr-2" />
                        Resend Code {timer > 0 && `(${timer}s)`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyCode;
