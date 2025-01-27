import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../fetch/fetch.js';
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown";
import { Context } from '../../Context/Context';
import './AppointmentScreen.css';

const AppointmentScreen = () => {
    const { user, setUser, language } = useContext(Context);
    const navigate = useNavigate();

    // Multilingual texts
    const texts = {
        en: {
            welcome: "Welcome",
            bookAppointment: "please book me an appointment for a haircut",
            next: "NEXT"
        },
        fr: {
            welcome: "Bienvenue",
            bookAppointment: "veuillez me prendre un rendez-vous pour une coupe de cheveux",
            next: "SUIVANT"
        },
        ar: {
            welcome: "مرحباً",
            bookAppointment: "يرجى حجز موعد لقص الشعر",
            next: "التالي"
        }
    };

    const currentTexts = texts[language] || texts.en;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/api/users/user');
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate('/calendar');
            }
        };
        
        fetchUser();
    }, [setUser, navigate]);

    return (
        <div 
            className="container"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
            <img src="logo.png" alt="Logo" className="logo3" />
            <div className="user-circler">
                <AvatarDropdown />
            </div>
            <h2 className="welcome-text">
                {currentTexts.welcome}, {user?.user || 'User'}<br />
                {currentTexts.bookAppointment}
            </h2>
            <button 
                className="next-button" 
                onClick={() => navigate("/calendar")}
            >
                {currentTexts.next}
            </button>
        </div>
    );
};

export default AppointmentScreen;