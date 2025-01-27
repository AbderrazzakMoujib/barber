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
    const [language, setLanguage] = useState(() => {
        const storedLanguage = localStorage.getItem('language');
        return storedLanguage || 'en';
    });
    const [isLoading, setIsLoading] = useState(true);

    const loginAdmin = async (code) => {
        try {
            const { data } = await axios.post('/api/admin/login', { code });
            if (data) {
                const adminData = {
                    ...data,
                    isAdmin: true,
                };
                setAdmin(adminData);
                localStorage.setItem('admin', JSON.stringify(adminData));
                setAvatar(data.avatar || data.name.charAt(0).toUpperCase());
            }
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const checkAuth = async () => {
        try {
            if (!admin?.token) {
                setIsLoading(false);
                return;
            }

            const { data } = await axios.get('/api/admin/me');
            if (data) {
                const adminData = {
                    ...data,
                    isAdmin: true,
                    token: admin.token, // Preserve the token
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
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('admin');
            setAdmin(null);
            setAvatar(null);
            window.location.href = '/admin-login';
        }
    };

    const setLanguagePreference = async (newLanguage) => {
        try {
            // Update local state immediately for better UX
            setLanguage(newLanguage);
            localStorage.setItem('language', newLanguage);

            // If user is logged in, sync with backend
            if (user?._id || admin?.token) {
                const { data } = await axios.post('/api/language/set', { language: newLanguage });
                console.log(`Language set to: ${data.language}`);
            }
        } catch (error) {
            console.error('Error setting language:', error);
            // Optionally revert on error
            const storedLanguage = localStorage.getItem('language');
            setLanguage(storedLanguage || 'en');
        }
    };

    useEffect(() => {
        if (admin?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
            checkAuth();
        } else {
            setIsLoading(false);
        }
    }, [admin?.token]);

    if (isLoading) {
        return <div>
            {language === 'ar' ? 'جاري التحميل...' : 
             language === 'fr' ? 'Chargement...' : 
             'Loading...'}
        </div>;
    }

    return (
        <Context.Provider
            value={{
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
                loginAdmin,
                language,
                setLanguagePreference,
            }}
        >
            {children}
        </Context.Provider>
    );
};