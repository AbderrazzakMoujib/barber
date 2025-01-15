// AvatarDropdown.js
import React, { useContext, useState } from "react";
import { Context } from "../../Context/Context";
import axiosInstance from "../../fetch/fetch";
import { useNavigate } from "react-router-dom";
import "./AvatarDropdown.css";

const AvatarDropdown = () => {
  const { avatar, setAvatar, user, setUser } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const getInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/users/logout');
      setUser(null);
      setAvatar(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleOptionClick = async (option) => {
    if (option === "logout") {
      await handleLogout();
    } else if (option === "profile") {
      console.log("Navigate to profile");
    }
    setIsDropdownOpen(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="avatar-container">
      <div
        className="avatar-wrapper"
        onClick={() => user && setIsDropdownOpen(!isDropdownOpen)}
      >
        {avatar ? (
          <img src={avatar} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder" style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {getInitial()}
          </div>
        )}
      </div>

      {isDropdownOpen && user && (
        <div className="dropdown-menu">
          <label htmlFor="avatar-upload" className="dropdown-item">
            <i className="fas fa-image"></i> Changer l'avatar
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            className="avatar-input-hidden"
          />
          <button
            className="dropdown-item"
            onClick={() => handleOptionClick("profile")}
          >
            <i className="fas fa-user-circle"></i> Voir le profil
          </button>
          <button
            className="dropdown-item"
            onClick={() => handleOptionClick("logout")}
          >
            <i className="fas fa-sign-out-alt"></i> Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;