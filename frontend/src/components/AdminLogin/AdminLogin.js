// components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AdminLogin.css';
import axiosInstance from '../../fetch/fetch.js';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);

    const handleCodeChange = (index, value) => {
        if (value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value !== '' && index < 4) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const adminCode = code.join('');
        
        if (adminCode.length !== 5) {
            toast.error('Please enter the complete code');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axiosInstance.post('/api/admin/login', {
                code: adminCode,
            });

            localStorage.setItem('admin', JSON.stringify(response.data));
            
            toast.success('Login successful!');
            navigate('/admin', { state: { adminName: response.data.name } });
        } catch (error) {
            toast.error('Invalid admin code');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <img src="/logo.PNG" alt="Admin Logo" />
                </div>
                <h2>Admin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="code-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;