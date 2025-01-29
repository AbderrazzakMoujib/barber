import React, { useContext, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import './AdminPage.css';
import axios from '../../fetch/fetch';
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";

const AdminPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, setAdmin, language, setLanguagePreference } = useContext(Context); // Add language context
    const adminName = admin?.name || location.state?.adminName || 'Admin';

    useEffect(() => {
        // Check if admin data exists in localStorage on component mount
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin && !admin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/admin/logout");
            setAdmin(null);
            localStorage.clear();
            navigate("/admin-login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Handle language selection
    const handleLanguageClick = async (selectedLanguage) => {
        try {
            await setLanguagePreference(selectedLanguage);
            alert(`Language set to ${selectedLanguage === 'ar' ? 'Arabic' : selectedLanguage === 'fr' ? 'French' : 'English'}`);
        } catch (error) {
            console.error('Error setting language:', error);
            alert('Failed to set language');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-headers">
                <div className="admin-profile">
                    <h1>
                        {language === 'ar' ? 'مرحبًا' : 
                         language === 'fr' ? 'Bienvenue' : 
                         'Welcome'}, {adminName}!
                    </h1>
                </div>

                {/* Language Selection Buttons */}
                <div className="language-buttons">
                    <button
                        className={`language-button ${language === 'ar' ? 'active' : ''}`}
                        onClick={() => handleLanguageClick('ar')}
                    >
                        Arabe/العربية
                    </button>
                    <button
                        className={`language-button ${language === 'fr' ? 'active' : ''}`}
                        onClick={() => handleLanguageClick('fr')}
                    >
                        Français
                    </button>
                    <button
                        className={`language-button ${language === 'en' ? 'active' : ''}`}
                        onClick={() => handleLanguageClick('en')}
                    >
                        English
                    </button>
                </div>
            </div>

            <div className="admin-content">
                <div className="admin-avatar-sections">
                    <div className="avatar-containersa">
                        <AdminAvatarDropdown initialName={adminName} />
                    </div>
                </div>

                <div className="admin-actions">
                    <Link to="/calendar" className="fix-next-button">
                        {language === 'ar' ? 'التقويم' : 
                         language === 'fr' ? 'Calendrier' : 
                         'Calendar'}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;