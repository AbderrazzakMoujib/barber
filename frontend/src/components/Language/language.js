import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import './language.css';

const Language = () => {
    const navigate = useNavigate();
    const { setLanguagePreference } = useContext(Context);

    const handleLanguageClick = async (language) => {
        await setLanguagePreference(language);
        navigate('/booking');
    };

    return (
        <div className="container">
            <img
                src="logo.png"
                alt="Logo"
                className="logo"
            />
            <div className="buttons">
                <button
                    className="language-button"
                    onClick={() => handleLanguageClick('ar')}
                >
                    Arabe/العربية
                </button>
                <button
                    className="language-button"
                    onClick={() => handleLanguageClick('fr')}
                >
                    Français
                </button>
                <button
                    className="language-button"
                    onClick={() => handleLanguageClick('en')}
                >
                    English
                </button>
            </div>
        </div>
    );
};

export default Language;