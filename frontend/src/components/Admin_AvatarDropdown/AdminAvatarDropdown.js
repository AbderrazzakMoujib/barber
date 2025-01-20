// src/components/AdminAvatarDropdown/AdminAvatarDropdown.js
import React, { useContext, useState } from "react";
import { Context } from "../../Context/Context";
import "./AdminAvatarDropdown.css";

const AdminAvatarDropdown = () => {
    const { admin, handleLogout } = useContext(Context);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="admin-avatar-dropdown">
            <div 
                className="avatar-container" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <div className="avatar-placeholder">
                    {admin?.name ? admin.name.charAt(0).toUpperCase() : '?'}
                </div>
            </div>
            
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminAvatarDropdown;