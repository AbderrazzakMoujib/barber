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
  const location = useLocation();
  const { setAdmin } = useContext(Context);
  const adminName = admin?.name || location.state?.adminName || 'Admin';
  const isAdmin = Boolean(admin);

  useEffect(() => {
    // Check if admin data exists in localStorage on component mount
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin && !admin) {
        setAdmin(JSON.parse(storedAdmin));
    }
  }, [admin, setAdmin]);

  useEffect(() => {
    const fetchWorkingDaysAndReservations = async () => {
      try {
        const workingDaysResponse = await axios.get("/api/reservations/working-days", {
          params: {
            month: format(currentDate, "MM"),
            year: format(currentDate, "yyyy"),
          },
        });
        setWorkingDays(workingDaysResponse.data.workingDays);

        if (isAdmin) {
          const response = await axios.get("/api/reservations/all", {
            params: {
              date: format(currentDate, "yyyy-MM-dd"),
            },
          });
          
          const reservationsMap = {};
          response.data.forEach(reservation => {
            const day = new Date(reservation.date).getDate();
            reservationsMap[day] = true;
          });
          setReservationDays(reservationsMap);
        }

        const pastReservationsResponse = await axios.get("/api/reservations/past-reservations", {
          params: {
            month: format(currentDate, "MM"),
            year: format(currentDate, "yyyy"),
          },
        });
        setPastReservations(pastReservationsResponse.data.reservations);
        
        toast.success("Calendar loaded successfully 📅");
      } catch (error) {
        console.error("Error loading data", error);
        toast.error("Failed to load calendar data ❌");
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
      return response.data.hasAvailability;
    } catch (error) {
      console.error("Error checking day availability:", error);
      toast.error("Error checking availability ❌");
      return false;
    }
  };

  const handleDayClick = async (date, status) => {
    if (status === "rest-day") {
      toast.error("This day is not available for booking ⛔");
      return;
    }

    if (status === "past-day" || status === "past-with-reservation") {
      toast.warning("Cannot book past dates ⚠️");
      return;
    }

    if (status === "working-day") {
      const hasAvailability = await checkDayAvailability(date);
      if (!hasAvailability) {
        toast.warning("All time slots are full for this day. Please select another day. 📅");
        return;
      }
      
      toast.success("Date selected successfully! 🎉");
      navigate("/reservation", {
        state: { selectedDate: format(date, "yyyy-MM-dd") },
      });
    }
  };

  const getDayStatus = (date) => {
    const dayNumber = parseInt(format(date, "d"));
    const dayOfWeek = getDay(date);

    if (dayOfWeek === 2) return "rest-day";

    if (isPast(date) && !isToday(date)) {
      const hasReservations = pastReservations.includes(dayNumber);
      return hasReservations ? "past-with-reservation" : "past-day";
    }

    if (dayNumber === 0) {
      return "rest-day";
    }

    const isWorking = workingDays.includes(dayNumber);
    return isWorking ? "working-day" : "rest-day";
  };

  return (
    <div className="calendar-screen">
      <div className="calendar-top-bar">
        <div className="user-circles">
          {isAdmin ? <AdminAvatarDropdown initialName={adminName}/> : <AvatarDropdown />}
        </div>
        <img src="logo.png" alt="Logo" className="calendar-logo" />
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</button>
        </div>
        <div className="days">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}
        </div>
        <div className="weeks">
          {Array.from({ length: getDay(startOfMonth(currentDate)) === 0 ? 6 : getDay(startOfMonth(currentDate)) - 1 }).map((_, index) => (
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
                className={`day ${status}`}
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
          <div className="legend-items">
            <span className="legend-color working-day"></span> Jour Travaillé
          </div>
          <div className="legend-items">
            <span className="legend-color rest-day"></span> Jour de Repos
          </div>
          <div className="legend-items">
            <span className="legend-color past-day"></span> Jour Passé
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