import React, { useContext, useState } from "react";
import { Context } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "../../fetch/fetch";
import "./AdminAvatarDropdown.css";

const AdminAvatarDropdown = ({ initialName }) => {
    const { admin, setAdmin } = useContext(Context);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="admin-avatar-dropdown">
            <div className="avatar-container" onClick={toggleDropdown}>
                <div className="avatar-placeholder">
                    {admin?.name ? admin.name.charAt(0).toUpperCase() : '?'}
                </div>
            </div>
            
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminAvatarDropdown;