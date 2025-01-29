import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Import locale directly
import { Context } from '../../Context/Context';
import axios from '../../fetch/fetch';
import { toast } from 'react-toastify'; // Importing toast for notifications
import './AppointmentBooking.css';
import AvatarDropdown from '../AvatarDropdown/AvatarDropdown';

const AppointmentBooking = () => {
  const { user, setUser, language } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract slot and selectedDate from location state
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

  // Fetch user data if not already available
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const response = await axios.get('/api/users/user');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(
          language === 'ar'
            ? 'تعذر تحميل معلومات المستخدم'
            : language === 'fr'
            ? 'Impossible de charger les informations utilisateur'
            : 'Failed to load user information'
        );
      }
    };

    fetchUser();
  }, [user, setUser, language]);

  // Handle reservation submission
  const handleReservation = async () => {
    if (!slot) {
      setError(
        language === 'ar'
          ? 'الوقت المحدد غير موجود'
          : language === 'fr'
          ? 'Créneau horaire manquant'
          : 'Time slot is missing'
      );
      return;
    }

    if (!user) {
      setError(
        language === 'ar'
          ? 'يرجى تسجيل الدخول لإتمام الحجز'
          : language === 'fr'
          ? 'Veuillez vous connecter pour réserver'
          : 'Please log in to make a reservation'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reservationData = {
        timeSlot: slot,
        date: format(selectedDate, 'yyyy-MM-dd'),
        partySize: partySize,
        userId: user.id || user._id,
      };

      const response = await axios.post('/api/reservations', reservationData);

      // Show success toast notification
      toast.success(
        language === 'ar'
          ? `تم تأكيد الحجز لـ ${slot} في ${format(selectedDate, 'dd/MM/yyyy', { locale: fr })}`
          : language === 'fr'
          ? `Réservation confirmée pour ${slot} le ${format(selectedDate, 'dd/MM/yyyy', { locale: fr })}`
          : `Reservation confirmed for ${slot} on ${format(selectedDate, 'dd/MM/yyyy', { locale: fr })}`,
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
        }
      );

      // Navigate to the reservation confirmation page
      navigate('/reservation', {
        state: {
          selectedDate: format(selectedDate, 'yyyy-MM-dd'),
        },
      });
    } catch (error) {
      console.error('Reservation error:', error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (language === 'ar'
          ? 'حدث خطأ أثناء الحجز'
          : language === 'fr'
          ? 'Erreur lors de la réservation'
          : 'An error occurred during reservation');

      setError(errorMessage);

      // Show error toast notification
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="grop_logo_avatar">
        <div className="user-circle">
          <AvatarDropdown />
        </div>
        <div className="grop_logo">
          <img src="logo.png" alt="Logo" className="reservation-logo" />
        </div>
      </div>
      <div className="booking-content">
        <h1>
          {language === 'ar'
            ? 'حجز موعد'
            : language === 'fr'
            ? 'Réservation de Créneau'
            : 'Appointment Booking'}
        </h1>

        <div className="legend-items">
          <img src="chairImage-vide.png" alt="Chair Empty" />
        </div>

        <div className="booking-details">
          <p>
            {language === 'ar'
              ? 'التاريخ:'
              : language === 'fr'
              ? 'Date:'
              : 'Date:'}{' '}
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
          <p>
            {language === 'ar'
              ? 'الوقت المحدد:'
              : language === 'fr'
              ? 'Créneau horaire:'
              : 'Time Slot:'}{' '}
            {slot}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="party-size-selector">
          <label>
            {language === 'ar'
              ? 'عدد الأشخاص:'
              : language === 'fr'
              ? 'Nombre de personnes:'
              : 'Number of People:'}
          </label>
          <select
            value={partySize}
            onChange={(e) => setPartySize(parseInt(e.target.value))}
          >
            {[...Array(10).keys()].map((size) => (
              <option key={size + 1} value={size + 1}>
                {size + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="booking-actions">
          <button
            className="confirm-btn"
            onClick={handleReservation}
            disabled={loading}
          >
            {loading
              ? language === 'ar'
                ? 'جاري التحميل...'
                : language === 'fr'
                ? 'En cours...'
                : 'Loading...'
              : language === 'ar'
              ? 'تأكيد الحجز'
              : language === 'fr'
              ? 'Confirmer la Réservation'
              : 'Confirm Reservation'}
          </button>
          <button onClick={() => navigate(-1)} className="cancel-button">
            {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
        </div>

        <div className="warning">
          <p>
            {language === 'ar'
              ? 'يرجى الحضور في الوقت المحدد والتحقق من الرسائل للتأكيد.'
              : language === 'fr'
              ? 'Veuillez être à l\'heure et vérifier vos messages pour la confirmation.'
              : 'Please be on time and check your messages for confirmation.'}
          </p>
          <span>
            {language === 'ar'
              ? 'يجب إلغاء أو تعديل الحجز قبل 15 دقيقة على الأقل من الوقت المحدد!'
              : language === 'fr'
              ? 'Vous devez annuler ou modifier votre rendez-vous au moins 15 minutes avant l\'heure prévue!'
              : 'You must cancel or modify your appointment at least 15 minutes before the scheduled time!'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
