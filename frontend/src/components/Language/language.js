import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importer framer-motion
import { Context } from '../../Context/Context';
import './language.css';

const Language = () => {
  const navigate = useNavigate();
  const { setLanguagePreference } = useContext(Context);

  const handleLanguageClick = async (language) => {
    try {
      await setLanguagePreference(language);
      navigate('/booking');
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }} // Début de l'animation : invisible
      animate={{ opacity: 1 }} // Animation : devient visible
      exit={{ opacity: 0 }} // Fin de l'animation : redevient invisible
      transition={{ duration: 1 }} // Durée de l'animation
    >
      <img src="logo.png" alt="Logo" className="logoA" />
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
    </motion.div>
  );
};

export default Language;