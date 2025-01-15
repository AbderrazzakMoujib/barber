import React from 'react';
import { Link } from 'react-router-dom'; // Importer Link
import './LandingPage.css'; // Importer le CSS pour le style

const LandingPage = () => {
  
  return (
    <div className="landing-page">
      <Link to="/booking"> {/* Redirige vers la page d'accueil */}
        <img src="/logo.PNG" alt="Barber Reda Logo" className="logo" />
      </Link>
    </div>
  );
};

export default LandingPage;
