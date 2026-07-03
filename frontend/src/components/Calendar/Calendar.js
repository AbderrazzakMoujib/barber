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
  const { user, admin, language } = useContext(Context);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workingDays, setWorkingDays] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [reservationDays, setReservationDays] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = Boolean(admin);

  // Translations object
  const translations = {
    en: {
      loading: "Loading calendar...",
      error: "Error loading calendar",
      workingDay: "Working Day",
      restDay: "Rest Day",
      pastDay: "Past Day",
      withReservations: "Day with Reservations",
      success: "Calendar loaded successfully 📅",
      error: "Failed to load calendar ❌",
      notAvailable: "This day is not available for booking ⛔",
      pastDate: "Cannot book past dates ⚠️",
      fullDay: "All slots are full for this day. Please select another day. 📅",
      availability: "Error checking availability ❌",
      weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      loadError: "Error loading calendar",        // ← كانت "error" مرتين
      toastError: "Failed to load calendar ❌",   // ← هادي هي التانية
    },
    fr: {
      loading: "Chargement du calendrier...",
      error: "Erreur de chargement",
      workingDay: "Jour Travaillé",
      restDay: "Jour de Repos",
      pastDay: "Jour Passé",
      withReservations: "Jour avec Réservations",
      success: "Calendrier chargé avec succès 📅",
      error: "Échec du chargement du calendrier ❌",
      notAvailable: "Ce jour n'est pas disponible pour la réservation ⛔",
      pastDate: "Impossible de réserver des dates passées ⚠️",
      fullDay: "Tous les créneaux sont complets pour ce jour. Veuillez sélectionner un autre jour. 📅",
      availability: "Erreur lors de la vérification de la disponibilité ❌",
      weekDays: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
      loadError: "Erreur de chargement",
  toastError: "Échec du chargement du calendrier ❌",
    },
    ar: {
      loading: "جاري تحميل التقويم...",
      error: "خطأ في التحميل",
      workingDay: "يوم عمل",
      restDay: "يوم راحة",
      pastDay: "يوم مضى",
      withReservations: "يوم به حجوزات",
      success: "تم تحميل التقويم بنجاح 📅",
      error: "فشل في تحميل التقويم ❌",
      notAvailable: "هذا اليوم غير متاح للحجز ⛔",
      pastDate: "لا يمكن الحجز في تواريخ سابقة ⚠️",
      fullDay: "جميع المواعيد محجوزة لهذا اليوم. يرجى اختيار يوم آخر. 📅",
      availability: "خطأ في التحقق من التوفر ❌",
      weekDays: ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"],
      loadError: "خطأ في التحميل",
  toastError: "فشل في تحميل التقويم ❌",
    }
  };

  // Get current translations
  const t = translations[language] || translations.en;

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
      toast.error(t.availability);
      return false;
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

    // Check if it's a working day
    const isWorking = workingDays.includes(dayNumber);
    return isWorking ? "working-day" : "rest-day";
  };

  useEffect(() => {
    const fetchWorkingDaysAndReservations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const workingDaysResponse = await axios.get("/api/reservations/working-days", {
          params: {
            month: format(currentDate, "MM"),
            year: format(currentDate, "yyyy"),
          },
        });
        
        if (workingDaysResponse.data?.workingDays) {
          setWorkingDays(workingDaysResponse.data.workingDays);
        }

        if (isAdmin) {
          const response = await axios.get("/api/reservations/all", {
            params: {
              month: format(currentDate, "MM"),
              year: format(currentDate, "yyyy"),
            },
          });
          
          if (response.data) {
            const reservationsMap = {};
            response.data.forEach(reservation => {
              const day = new Date(reservation.date).getDate();
              reservationsMap[day] = true;
            });
            setReservationDays(reservationsMap);
          }
        }

        const pastReservationsResponse = await axios.get("/api/reservations/past-reservations", {
          params: {
            month: format(currentDate, "MM"),
            year: format(currentDate, "yyyy"),
          },
        });
        
        if (pastReservationsResponse.data?.reservations) {
          setPastReservations(pastReservationsResponse.data.reservations);
        }
        
        toast.success(t.success);
      } catch (error) {
        console.error("Error loading data", error);
        setError(error.response?.data?.message || t.error);
        toast.error(t.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkingDaysAndReservations();
  }, [currentDate, isAdmin, language]);

  const handleDayClick = async (date, status) => {
    if (status === "rest-day") {
      toast.error(t.notAvailable);
      return;
    }
   
    if (status === "past-day" || status === "past-with-reservation") {
      toast.warning(t.pastDate);
      return;
    }
   
    if (status === "working-day") {
      if (!isAdmin) {
        const hasAvailability = await checkDayAvailability(date);
        if (!hasAvailability) {
          toast.warning(t.fullDay);
          return;
        }
      }
      
      navigate("/reservation", {
        state: { selectedDate: format(date, "yyyy-MM-dd") },
      });
    }
  };

  // Handle month navigation based on language direction
  const handleMonthChange = (direction) => {
    if (language === 'ar') {
      // For RTL languages, reverse the navigation direction
      direction === 'next' ? setCurrentDate(subMonths(currentDate, 1)) : setCurrentDate(addMonths(currentDate, 1));
    } else {
      direction === 'next' ? setCurrentDate(addMonths(currentDate, 1)) : setCurrentDate(subMonths(currentDate, 1));
    }
  };

  if (isLoading) {
    return <div className="loading">{t.loading}</div>;
  }

  if (error) {
    return <div className="error">{t.error}: {error}</div>;
  }

  return (
    <div className={`calendar-screen ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="calendar-top-bar">
        <div className="user-circles">
          {isAdmin ? <AdminAvatarDropdown /> : <AvatarDropdown />}
        </div>
        <img src="/logo.png" alt="Logo" className="calendar-logo" />
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            onClick={() => handleMonthChange('prev')}
            className="month-nav-button"
          >
            {language === 'ar' ? '>' : '<'}
          </button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button 
            onClick={() => handleMonthChange('next')}
            className="month-nav-button"
          >
            {language === 'ar' ? '<' : '>'}
          </button>
        </div>

        <div className="days">
          {t.weekDays.map((day) => (
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
            {t.workingDay}
          </div>
          <div className="legend-item">
            <span className="legend-color rest-day"></span>
            {t.restDay}
          </div>
          <div className="legend-item">
            <span className="legend-color past-day"></span>
            {t.pastDay}
          </div>
          {isAdmin && (
            <div className="legend-item">
              <span className="legend-color">
                <div className="reservation-dot-legend"></div>
              </span>
              {t.withReservations}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;