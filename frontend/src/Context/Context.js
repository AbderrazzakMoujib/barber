// src/Context/Context.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '../fetch/fetch';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(() => {
        const storedAdmin = localStorage.getItem('admin');
        return storedAdmin ? JSON.parse(storedAdmin) : null;
    });
    const [avatar, setAvatar] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loginAdmin = async (code) => {
        try {
            const { data } = await axios.post('/api/admin/login', { code });
            if (data) {
                setAdmin(data);
                localStorage.setItem('admin', JSON.stringify(data));
                setAvatar(data.avatar || data.name.charAt(0).toUpperCase());
            }
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get('/api/admin/me');
            
            if (data) {
                const adminData = {
                    ...data,
                    isAdmin: true
                };
                setAdmin(adminData);
                localStorage.setItem('admin', JSON.stringify(adminData));
                setAvatar(data.avatar || data.name.charAt(0).toUpperCase());
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('admin');
            setAdmin(null);
            setAvatar(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/admin/logout');
            localStorage.removeItem('admin');
            setAdmin(null);
            setAvatar(null);
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        if (admin?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
        }
        checkAuth();
    }, [admin?.token]);

    if (isLoading) {
        return null;
    }

    return (
        <Context.Provider value={{ 
            user, 
            setUser, 
            admin,
            setAdmin,
            avatar, 
            setAvatar,
            reservations, 
            setReservations,
            handleLogout,
            checkAuth,
            loginAdmin
        }}>
            {children}
        </Context.Provider>
    );
};