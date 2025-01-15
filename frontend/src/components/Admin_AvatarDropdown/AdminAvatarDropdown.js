import React, { useContext, useState } from "react";
import { Context } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "../../fetch/fetch";
import "./AdminAvatarDropdown.css";

const AdminAvatarDropdown = () => {
  const { admin, setAdmin } = useContext(Context); // Fetch admin data from Context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const getInitial = () => {
    if (admin && admin.name) {
      return admin.name.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/admin/logout");
      setAdmin(null); // Clear admin data
      localStorage.clear(); // Clear local storage
      navigate("/admin-login"); // Redirect to admin login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="admin-avatar-dropdown">
      <div className="avatar-container" onClick={toggleDropdown}>
        {admin?.avatar ? (
          <img src={admin.avatar} alt="Admin Avatar" className="admin-avatar-image" />
        ) : (
          <div className="avatar-placeholders"style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {getInitial()}
          </div>
        )}
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
