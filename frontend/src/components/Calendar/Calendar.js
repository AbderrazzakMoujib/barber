import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  getDay,
  isPast,
  isToday,
} from "date-fns";
import { toast } from "react-toastify";
import axios from "../../fetch/fetch";
import { Context } from "../../Context/Context";
import AvatarDropdown from "../AvatarDropdown/AvatarDropdown";
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";
import "./Calendar.css";

const Calendar = () => {
  const { user, admin } = useContext(Context);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workingDays, setWorkingDays] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [reservationDays, setReservationDays] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isAdmin = Boolean(admin);

  useEffect(() => {
    const fetchWorkingDaysAndReservations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch working days for the current month
        const workingDaysResponse = await axios.get("/api/reservations/working-days", {
          params: {
            month: format(currentDate, "MM"),
            year: format(currentDate, "yyyy"),
          },
        });
        
        if (workingDaysResponse.data?.workingDays) {
          setWorkingDays(workingDaysResponse.data.workingDays);
        }

        // For admin, fetch all reservations to show days with bookings
        if (isAdmin) {
          const response = await axios.get("/api/reservations/all", {
            params: {
              month: format(currentDate, "MM"),
              year: format(currentDate, "yyyy"),
            },
          });
          
          if (response.data) {
            // Create a map of days with reservations
            const reservationsMap = {};
            response.data.forEach(reservation => {
              const day = new Date(reservation.date).getDate();
              reservationsMap[day] = true;
            });
            setReservationDays(reservationsMap);
          }
        }

        // Fetch past reservations
        const pastReservationsResponse = await axios.get("/api/reservations/past-reservations", {
          params: {
            month: format(currentDate, "MM"),
            year: format(currentDate, "yyyy"),
          },
        });
        
        if (pastReservationsResponse.data?.reservations) {
          setPastReservations(pastReservationsResponse.data.reservations);
        }
        
        toast.success("Calendrier chargé avec succès 📅");
      } catch (error) {
        console.error("Error loading data", error);
        setError(error.response?.data?.message || "Error loading calendar data");
        toast.error("Échec du chargement du calendrier ❌");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkingDaysAndReservations();
  }, [currentDate, isAdmin]);

  const checkDayAvailability = async (date) => {
    try {
      const response = await axios.get('/api/reservations/day-availability', {
        params: {
          date: format(date, "yyyy-MM-dd")
        }
      });
      return response.data?.hasAvailability ?? false;
    } catch (error) {
      console.error("Error checking day availability:", error);
      toast.error("Erreur lors de la vérification de la disponibilité ❌");
      return false;
    }
   };
   
   const handleDayClick = async (date, status) => {
    if (status === "rest-day") {
      toast.error("Ce jour n'est pas disponible pour la réservation ⛔");
      return;
    }
   
    if (status === "past-day" || status === "past-with-reservation") {
      toast.warning("Impossible de réserver des dates passées ⚠️");
      return;
    }
   
    if (status === "working-day") {
      if (!isAdmin) {
        const hasAvailability = await checkDayAvailability(date);
        if (!hasAvailability) {
          toast.warning("Tous les créneaux sont complets pour ce jour. Veuillez sélectionner un autre jour. 📅");
          return;
        }
      }
      
      navigate("/reservation", {
        state: { selectedDate: format(date, "yyyy-MM-dd") },
      });
    }
   };

  const getDayStatus = (date) => {
    const dayNumber = parseInt(format(date, "d"));
    const dayOfWeek = getDay(date);

    // Tuesday is rest day
    if (dayOfWeek === 2) return "rest-day";

    // Past days
    if (isPast(date) && !isToday(date)) {
      const hasReservations = pastReservations.includes(dayNumber);
      return hasReservations ? "past-with-reservation" : "past-day";
    }

    // Sunday is rest day
    if (dayOfWeek === 0) {
      return "rest-day";
    }

    // Check if it's a working day
    const isWorking = workingDays.includes(dayNumber);
    return isWorking ? "working-day" : "rest-day";
  };

  if (isLoading) {
    return <div className="loading">Loading calendar...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="calendar-screen">
      <div className="calendar-top-bar">
        <div className="user-circles">
          {isAdmin ? <AdminAvatarDropdown /> : <AvatarDropdown />}
        </div>
        <img src="/logo.png" alt="Logo" className="calendar-logo" />
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="month-nav-button"
          >
            &lt;
          </button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="month-nav-button"
          >
            &gt;
          </button>
        </div>

        <div className="days">
          {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((day) => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}
        </div>

        <div className="weeks">
          {Array.from({ 
            length: getDay(startOfMonth(currentDate)) === 0 
              ? 6 
              : getDay(startOfMonth(currentDate)) - 1 
          }).map((_, index) => (
            <div key={`empty-${index}`} className="day empty"></div>
          ))}

          {eachDayOfInterval({
            start: startOfMonth(currentDate),
            end: endOfMonth(currentDate),
          }).map((date) => {
            const status = getDayStatus(date);
            const dayNumber = date.getDate();
            const hasReservations = reservationDays[dayNumber];
            
            return (
              <div
                key={date}
                className={`day ${status} ${hasReservations ? 'has-reservations' : ''}`}
                onClick={() => handleDayClick(date, status)}
              >
                {format(date, "d")}
                {isAdmin && hasReservations && (
                  <div className="reservation-dot"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-color working-day"></span>
            Jour Travaillé
          </div>
          <div className="legend-item">
            <span className="legend-color rest-day"></span>
            Jour de Repos
          </div>
          <div className="legend-item">
            <span className="legend-color past-day"></span>
            Jour Passé
          </div>
          {isAdmin && (
            <div className="legend-item">
              <span className="legend-color">
                <div className="reservation-dot-legend"></div>
              </span>
              Jour avec Réservations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;