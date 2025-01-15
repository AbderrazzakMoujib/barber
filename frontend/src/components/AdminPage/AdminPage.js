import React, { useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import './AdminPage.css';
import axios from '../../fetch/fetch';
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";

const AdminPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { admin, setAdmin } = useContext(Context);
    const adminName = admin?.name || location.state?.adminName || 'Admin';

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

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-profile">
                    <h1>Welcome, {adminName}!</h1>
                </div>
            </div>

            <div className="admin-content">
                <div className="admin-avatar-section">
                    <div className="avatar-container">
                        <AdminAvatarDropdown/>
                    </div>
                </div>

                <div className="admin-actions">
                    <Link to="/calendar" className="fix-next-button">
                        Fix Next
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;