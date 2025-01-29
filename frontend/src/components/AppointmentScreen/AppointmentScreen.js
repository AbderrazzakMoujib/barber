// AppointmentScreen.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../fetch/fetch.js';
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown";
import { Context } from '../../Context/Context';
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import './AppointmentScreen.css';

const AppointmentScreen = () => {
    const { user, setUser, language } = useContext(Context);
    const navigate = useNavigate();

    // Multilingual texts
    const texts = {
        en: {
            welcome: "Welcome",
            bookAppointment: "Book your appointment",
            services: "Our Services",
            next: "NEXT",
            haircut: "Haircut",
            beard: "Beard Trim",
            combo: "Haircut & Beard"
        },
        fr: {
            welcome: "Bienvenue",
            bookAppointment: "Prenez rendez-vous",
            services: "Nos Services",
            next: "SUIVANT",
            haircut: "Coupe de cheveux",
            beard: "Taille de barbe",
            combo: "Coupe & Barbe"
        },
        ar: {
            welcome: "مرحباً",
            bookAppointment: "احجز موعدك",
            services: "خدماتنا",
            next: "التالي",
            haircut: "قص شعر",
            beard: "تشذيب اللحية",
            combo: "قص شعر وتشذيب"
        }
    };

    const currentTexts = texts[language] || texts.en;

    const services = [
        { id: 1, name: currentTexts.haircut, duration: "30 min" },
        { id: 2, name: currentTexts.beard, duration: "20 min"},
        { id: 3, name: currentTexts.combo, duration: "45 min"}
    ];

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
            className="app-container"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="header">
                <img src="logo.png" alt="Logo" className="logo" />
                <div className="avatar-container">
                    <AvatarDropdown />
                </div>
            </div>

            <div className="welcome-section">
                <h1 className="welcome-title">
                    {currentTexts.welcome}, {user?.user || 'User'}
                </h1>
                <p className="welcome-subtitle">
                    {currentTexts.bookAppointment}
                </p>
            </div>

            <div className="services-section">
                <h2 className="services-title">{currentTexts.services}</h2>
                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-content">
                                <div className="service-info">
                                    <h3 className="service-name">{service.name}</h3>
                                    <div className="service-duration">
                                        <Clock className="duration-icon" />
                                        <span>{service.duration}</span>
                                    </div>
                                </div>
                                <div className="service-price">{service.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                className="next-button" 
                onClick={() => navigate("/calendar")}
            >
                <span>{currentTexts.next}</span>
                {language === 'ar' ? (
                    <ChevronLeft className="button-icon" />
                ) : (
                    <ChevronRight className="button-icon" />
                )}
            </button>
        </div>
    );
};

export default AppointmentScreen;