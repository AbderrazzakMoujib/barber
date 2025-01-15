import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../fetch/fetch.js'; // Ensure correct path
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown"; // Import du composant
import { Context } from '../../Context/Context';
import './AppointmentScreen.css';

const AppointmentScreen = () => {
    const { user, setUser } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/api/users/user');
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate('/calendar'); // Redirect to login on error
            }
        };
        
        fetchUser();
    }, [setUser, navigate]);

    const initials = user?.user ? user.user.charAt(0).toUpperCase() : '?';

    return (
        <div className="container">
            <img src="logo.png" alt="Logo" className="logo3" />
            <div className="user-circler">
          <AvatarDropdown /> 
            </div>
            <h2 className="welcome-text">
                Welcome, {user?.user || 'User'}<br />
                please book me an appointment for a haircut
            </h2>
            <button className="next-button" onClick={() => navigate("/calendar")}>NEXT</button>
        </div>
    );
};

export default AppointmentScreen;