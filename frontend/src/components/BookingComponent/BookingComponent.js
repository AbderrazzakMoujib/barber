import React from 'react';
import './BookingComponent.css';  // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';



const BookingComponent = () => {
  const navigate = useNavigate()
  return (
    <div className="booking-container">
      <div className="logo-bak">
        <img className='logo-img' src="/logo.PNG" alt="Logo"  />
      </div>
      <div className="booking-card">
        <p>Do you want to book an appointment for a haircut?</p>
        <button className="booking-button" onClick={()=> navigate("/login")}>Schedule your appointment</button>
      </div>
    </div>
  );
};

export default BookingComponent;
