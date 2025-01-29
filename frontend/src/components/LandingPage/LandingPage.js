import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importer framer-motion
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/language');
    }, 2000); // Redirection après 2 secondes

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="landing-page"
      initial={{ opacity: 0 }} // Début de l'animation : invisible
      animate={{ opacity: 1 }} // Animation : devient visible
      exit={{ opacity: 0 }} // Fin de l'animation : redevient invisible
      transition={{ duration: 1 }} // Durée de l'animation
    >
      <img src="/logo.PNG" alt="Barber Reda Logo" className="logo" />
    </motion.div>
  );
};

export default LandingPage;
