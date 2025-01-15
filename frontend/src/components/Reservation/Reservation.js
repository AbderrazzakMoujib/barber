import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "../../fetch/fetch";
import { Context } from "../../Context/Context";
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown";
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";
import "./Reservation.css";

const TimeSlot = ({ slot, isReserved, reservedUser, onClick }) => (
  <div
    className={`slot ${isReserved ? "full" : "empty"}`}
    onClick={() => onClick(slot, !isReserved)}
    style={{
      cursor: isReserved ? "not-allowed" : "pointer",
      opacity: isReserved ? 0.5 : 1,
    }}
  >
    <img
      src={isReserved ? "chairImage.png" : "chairImage-vide.png"}
      alt="Chair"
      className="chair-icon"
    />
    <span>{slot}</span>
    {isReserved && <div className="reserved-overlay">Réservé</div>}
    {reservedUser && <div className="reserved-user">{reservedUser}</div>}
  </div>
);

const Reservation = () => {
  const { user, setUser, admin } = useContext(Context);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const [userResponse, reservationsResponse] = await Promise.all([
          axios.get("/api/users/user"),
          axios.get(`/api/reservations/all?date=${format(currentDate, "yyyy-MM-dd")}`),
        ]);
        setUser(userResponse.data.user);
        setReservations(reservationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors de la récupération des réservations", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setUser, currentDate]);

  const getUserInitials = () =>
    user?.firstName?.charAt(0).toUpperCase() || user?.user?.charAt(0).toUpperCase() || "?";

  const isSlotReserved = (slot) =>
    reservations.some(
      (res) =>
        res.timeSlot === slot &&
        new Date(res.date).toDateString() === currentDate.toDateString()
    );

  const getReservedUser = (slot) => {
    const reservation = reservations.find(
      (res) =>
        res.timeSlot === slot &&
        new Date(res.date).toDateString() === currentDate.toDateString()
    );
    return reservation?.user?.firstName || reservation?.user?.name || "Utilisateur";
  };

  const handleSlotClick = (slot, isEmpty) => {
    if (!isEmpty) {
      toast.error(`Le créneau ${slot} est déjà réservé`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    navigate(`/appointment-booking`, {
      state: { slot, selectedDate: currentDate },
    });
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
            {isAdmin ? <AdminAvatarDropdown initialName={adminName}/> : <AvatarDropdown />}
          </div>
        </div>
        <img src="logo.png" alt="Logo" className="reservation-logo" />
      </div>

      <div className="reservation-container">
        <div className="user-section">
          <span>Créneaux Horaires pour {format(currentDate, "dd/MM/yyyy")}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Reservation;