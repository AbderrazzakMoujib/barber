import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Import locale directly
import { Context } from '../../Context/Context';
import axios from '../../fetch/fetch';
import { toast } from 'react-toastify';  // Importing toast for notifications
import './AppointmentBooking.css';
import AvatarDropdown from '../AvatarDropdown/AvatarDropdown';

const AppointmentBooking = () => {
  const { user, setUser } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { slot, selectedDate: navigationDate } = location.state || {};
  const [selectedDate, setSelectedDate] = useState(() => {
    if (location.state?.selectedDate) {
      return new Date(location.state.selectedDate);
    }
    return new Date();
  });
  
  const [partySize, setPartySize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const response = await axios.get("/api/users/user");
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Impossible de charger les informations utilisateur");
      }
    };

    fetchUser();
  }, [user, setUser]);

  const handleReservation = async () => {
    if (!slot) {
      setError("Créneau horaire manquant");
      return;
    }

    if (!user) {
      setError("Veuillez vous connecter pour réserver");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reservationData = {
        timeSlot: slot,
        date: format(selectedDate, "yyyy-MM-dd"),
        partySize: partySize,
        userId: user.id || user._id
      };

      const response = await axios.post('/api/reservations', reservationData);

      // Toast success notification
      toast.success(`Réservation confirmée pour ${slot} le ${format(selectedDate, 'dd/MM/yyyy', { locale: fr })}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      navigate('/reservation', { 
        state: { 
          selectedDate: format(selectedDate, "yyyy-MM-dd")
        }
      });
    } catch (error) {
      console.error('Reservation error:', error.response?.data);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || "Erreur lors de la réservation";

      setError(errorMessage);

      // Toast error notification
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className='grop_logo_avatar'>
      <div className="user-circle">
        <AvatarDropdown/>
      </div>
      <div className='grop_logo'>
      <img src="logo.png" alt="Logo" className="reservation-logo" />
      </div>
    </div>
      <div className="booking-content">
        <h1>Réservation de Créneau</h1>

          <div className="legend-items">
            <img src="chairImage-vide.png" alt="Chair Empty" />
          </div>

        <div className="booking-details">
          <p>
            Date: {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} {/* Pass locale here */}
          </p>
          <p>Créneau horaire: {slot}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* <div className="party-size-selector">
          <label>Nombre de personnes:</label>
          <select 
            value={partySize} 
            onChange={(e) => setPartySize(parseInt(e.target.value))}
          >
            {partySizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div> */}

        <div className="booking-actions">
          <button 
            className="confirm-btn" 
            onClick={handleReservation} 
            disabled={loading}
          >
            {loading ? 'En cours...' : 'Confirmer la Réservation'}
          </button>
          <button 
            onClick={() => navigate(-1)} 
            className="cancel-button"
          >
            Annuler
          </button>
        </div>

        <div className="warning">
          <p>Veuillez être à l'heure et vérifier vos messages pour la confirmation.</p>
          <span>Vous devez annuler ou modifier votre rendez-vous au moins 15 minutes avant l'heure prévue!</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
