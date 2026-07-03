import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import { Globe } from 'lucide-react';
import axios from '../../fetch/fetch';
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";
import "./AdminPage.css";

const AdminPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, setAdmin, language, setLanguagePreference } = useContext(Context);
    const adminName = admin?.name || location.state?.adminName || 'Admin';
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin && !admin) {
            setAdmin(JSON.parse(storedAdmin));
        }

        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-controls')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
// eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleLanguageClick = async (selectedLanguage) => {
        try {
            await setLanguagePreference(selectedLanguage);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Error setting language:', error);
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
                <div className="language-controls">
                    <button 
                        className="language-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
                    >
                        <Globe className="language-icon" />
                    </button>
                    {isDropdownOpen && (
                        <div className="language-dropdown">
                            <button
                                className={`language-option ${language === 'ar' ? 'active' : ''}`}
                                onClick={() => handleLanguageClick('ar')}
                            >
                                العربية
                            </button>
                            <button
                                className={`language-option ${language === 'fr' ? 'active' : ''}`}
                                onClick={() => handleLanguageClick('fr')}
                            >
                                Français
                            </button>
                            <button
                                className={`language-option ${language === 'en' ? 'active' : ''}`}
                                onClick={() => handleLanguageClick('en')}
                            >
                                English
                            </button>
                        </div>
                    )}
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
                    <button className="logout-button" onClick={handleLogout}>
                        {language === 'ar' ? 'تسجيل الخروج' : 
                         language === 'fr' ? 'Déconnexion' : 
                         'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;