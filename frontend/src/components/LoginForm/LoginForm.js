// LoginForm.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../../Context/Context';
import axiosInstance from '../../fetch/fetch.js';
import './LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userInput: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(Context);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.userInput || !formData.password) {
            toast.error('Please fill in all fields 🚫');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Attempting login with:', { 
                user: formData.userInput,
                passwordLength: formData.password.length 
            });

            const response = await axiosInstance.post('/api/users/login', {
                user: formData.userInput,
                password: formData.password
            });
            
            console.log('Login response:', response.data);
            
            if (response.data && response.data._id) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success('Login successful! 🎉');
                navigate('/appointment-screen');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
            setFormData(prev => ({
                ...prev,
                password: ''
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminClick = () => {
        navigate('/admin-login');
    };

    return (
        <div>
            <div className="login-container">
                <div className="logo4">
                    <img className="logo-img4" src="/logo.PNG" alt="Logo" />
                </div>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="userInput">Username / Phone</label>
                    <input 
                        type="text" 
                        id="userInput" 
                        name="userInput" 
                        value={formData.userInput}
                        onChange={handleChange}
                        placeholder="Enter username or phone number"
                        disabled={isLoading}
                        required
                    />
                    
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        required
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={isLoading ? 'loading' : ''}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <p className="signup-text">
                    Don't have an account yet? <a href="/sign-in">Sign In</a>
                </p>
            </div>
            <div>
                <button 
                    type="button" 
                    className="admin-button" 
                    onClick={handleAdminClick}
                    disabled={isLoading}
                >
                    Admin
                </button>
            </div>
        </div>
    );
};

export default LoginForm;