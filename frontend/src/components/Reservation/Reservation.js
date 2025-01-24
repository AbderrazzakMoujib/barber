import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "../../fetch/fetch";
import { Context } from "../../Context/Context";
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown";
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";
import "./Reservation.css";

const TimeSlot = ({ slot, isReserved, reservedUser, onClick, isAdmin }) => (
  <div
    className={`slot ${isReserved ? "full" : "empty"}`}
    onClick={() => onClick(slot, !isReserved)}
    style={{
      cursor: isReserved && !isAdmin ? "not-allowed" : "pointer",
      opacity: isReserved ? 0.8 : 1,
    }}
  >
    <img
      src={isReserved ? "chairImage.png" : "chairImage-vide.png"}
      alt="Chair"
      className="chair-icon"
    />
    <span>{slot}</span>
    {isReserved && (
      <>
        <div className="reserved-overlay">Réservé</div>
        {isAdmin && reservedUser && (
          <div className="reserved-user">Par: {reservedUser}</div>
        )}
      </>
    )}
  </div>
);

const Reservation = () => {
  const { user, setUser, admin } = useContext(Context);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = Boolean(admin);
  const adminName = admin?.name || location.state?.adminName || 'Admin';

  const [currentDate, setCurrentDate] = useState(() =>
    location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date()
  );

  const availableSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00",
  ];

  const handleBackClick = () => {
    navigate('/calendar');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const date = format(currentDate, "yyyy-MM-dd");

        const config = {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        };

        const [userResponse, reservationsResponse] = await Promise.all([
          axios.get("/api/users/user", config),
          axios.get("/api/reservations/all", { ...config, params: { month, year, date } }),
        ]);

        if (!userResponse.data.success) {
          throw new Error('Failed to fetch user data');
        }

        setUser(userResponse.data.user);
        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || "Erreur lors de la récupération des données", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setUser, currentDate, navigate]);

  const isSlotReserved = (slot) =>
    reservations.some(
      (res) =>
        res.timeSlot === slot &&
        new Date(res.date).toDateString() === currentDate.toDateString()
    );

  const getReservationDetails = (slot) => {
    return reservations.find(
      (res) =>
        res.timeSlot === slot &&
        new Date(res.date).toDateString() === currentDate.toDateString()
    );
  };

  const getReservedUser = (slot) => {
    const reservation = getReservationDetails(slot);
    return reservation?.user?.firstName || reservation?.user?.name || "Client";
  };

  const handleSlotClick = (slot, isEmpty) => {
    if (!isEmpty) {
      if (isAdmin) {
        const reservation = getReservationDetails(slot);
        if (reservation) {
          navigate('/admin-appels', {
            state: {
              reservation: reservation,
              date: currentDate,
              timeSlot: slot
            }
          });
        } else {
          toast.error("Détails de la réservation non trouvés", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        toast.error(`Le créneau ${slot} est déjà réservé`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      return;
    }

    if (!isAdmin) {
      navigate(`/appointment-booking`, {
        state: { slot, selectedDate: currentDate },
      });
    }
  };

  if (isLoading) {
    return <div className="reservation-container">Chargement...</div>;
  }

  return (
    <div className="reservation-jiniral">
      <div className="reservation-top-bar">
        <div className="grop_avatar_rotor">
          <div className="back-button" onClick={handleBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="user-circles">
            {isAdmin ? <AdminAvatarDropdown initialName={adminName} /> : <AvatarDropdown />}
          </div>
        </div>
        <img src="logo.png" alt="Logo" className="reservation-logo" />
      </div>

      <div className="reservation-container">
        <div className="user-section">
          <span>
            {isAdmin ? "Réservations pour le " : "Créneaux Horaires pour le "}
            {format(currentDate, "dd/MM/yyyy")}
          </span>
        </div>

        <div className="schedule-section">
          <div className="schedule-grid">
            {availableSlots.map((slot) => (
              <TimeSlot
                key={slot}
                slot={slot}
                isReserved={isSlotReserved(slot)}
                reservedUser={getReservedUser(slot)}
                onClick={handleSlotClick}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>

        <div className="legend">
          <div className="legend-item">
            <img src="chairImage-vide.png" alt="Chair Empty" />
            Disponible
          </div>
          <div className="legend-item">
            <img src="chairImage.png" alt="Chair Full" />
            Réservé
          </div>
          {isAdmin && (
            <div className="legend-item admin-info">
              <i className="fas fa-info-circle"></i>
              Cliquez sur un créneau réservé pour voir les détails
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservation;