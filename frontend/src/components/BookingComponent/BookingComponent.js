import React, { useContext } from 'react';
import './BookingComponent.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';

const BookingComponent = () => {
  const navigate = useNavigate();
  const { language } = useContext(Context);

  const texts = {
    en: {
      title: "Do you want to book an appointment for a haircut?",
      button: "Schedule your appointment"
    },
    fr: {
      title: "Souhaitez-vous réserver un rendez-vous pour une coupe de cheveux ?",
      button: "Planifiez votre rendez-vous"
    },
    ar: {
      title: "هل تريد حجز موعد لحلاقة الشعر؟",
      button: "حدد موعدك"
    }
  };

  const currentTexts = texts[language] || texts.en;

  return (
    <div 
      className="booking-container"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="logo-bak">
        <img className='logo-img' src="/logo.PNG" alt="Logo" />
      </div>
      <div className="booking-card">
        <p>{currentTexts.title}</p>
        <button 
          className="booking-button" 
          onClick={() => navigate("/login")}
        >
          {currentTexts.button}
        </button>
      </div>
    </div>
  );
};

export default BookingComponent;
