import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SignInForm.css';
import axiosInstance from '../../fetch/fetch.js';

const SignInForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        user: '',
        phone: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // For phone, only allow digits
        if (name === 'phone') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({
                ...prev,
                [name]: numbersOnly
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.user.trim()) {
            newErrors.user = 'Username is required';
        } else if (formData.user.length < 3) {
            newErrors.user = 'Username must be at least 3 characters';
        }
        
        // Simple 10-digit validation
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post('/api/users/register', formData);
            toast.success('Registration successful! 🎉');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            
            // Handle specific backend errors
            if (err.response?.data?.field) {
                setErrors(prev => ({
                    ...prev,
                    [err.response.data.field]: errorMessage
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="logo5">
                <img className='logo-img3' src="/logo.PNG" alt="Logo" />
            </div>
            <form className="signin-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}

                <label htmlFor="user">Username</label>
                <input
                    type="text"
                    id="user"
                    name="user"
                    placeholder="Username"
                    value={formData.user}
                    onChange={handleChange}
                    className={errors.user ? 'error' : ''}
                />
                {errors.user && <span className="error-message">{errors.user}</span>}

                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter 10 digits"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            <p className="login-text">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
};

export default SignInForm;