import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import "./AdminAppel.css";
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";
import { toast } from "react-toastify";

const AdminAppel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, language, setLanguagePreference } = useContext(Context); // Add language context
  const { reservation, date, timeSlot } = location.state || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCall = () => {
    const phoneNumber = 
      reservation?.user?.phone || 
      reservation?.phone || 
      (language === 'ar' ? 'غير متوفر' : 
       language === 'fr' ? 'Non disponible' : 
       'Not available');
    
    if (phoneNumber !== (language === 'ar' ? 'غير متوفر' : 
                         language === 'fr' ? 'Non disponible' : 
                         'Not available')) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast.error(
        language === 'ar' ? 'رقم الهاتف غير متوفر' : 
        language === 'fr' ? 'Numéro de téléphone non disponible' : 
        'Phone number not available'
      );
    }
  };

  // Handle language selection
  const handleLanguageClick = async (selectedLanguage) => {
    try {
      await setLanguagePreference(selectedLanguage);
      toast.success(
        language === 'ar' ? 'تم تعيين اللغة بنجاح' : 
        language === 'fr' ? 'Langue définie avec succès' : 
        'Language set successfully'
      );
    } catch (error) {
      console.error('Error setting language:', error);
      toast.error(
        language === 'ar' ? 'فشل تعيين اللغة' : 
        language === 'fr' ? 'Échec de la définition de la langue' : 
        'Failed to set language'
      );
    }
  };

  if (!reservation) {
    return (
      <div className="admin-appel">
        {language === 'ar' ? 'لا توجد معلومات الحجز متاحة' : 
         language === 'fr' ? 'Aucune information de réservation disponible' : 
         'No reservation information available'}
      </div>
    );
  }

  const userName = reservation.user?.name || 
    (language === 'ar' ? 'غير متوفر' : 
     language === 'fr' ? 'Non disponible' : 
     'Not available');
  const userPhone = reservation.user?.phone || 
    (language === 'ar' ? 'غير متوفر' : 
     language === 'fr' ? 'Non disponible' : 
     'Not available');

  return (
    <div className="admin-appel">
      <div className="admin-appel-header">
        <div className="back-section">
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
          <AdminAvatarDropdown initialName={admin?.name || 'Admin'} />
        </div>

        {/* Language Selection Buttons */}
        <div className="language-buttons">
          <button
            className={`language-button ${language === 'ar' ? 'active' : ''}`}
            onClick={() => handleLanguageClick('ar')}
          >
            Arabe/العربية
          </button>
          <button
            className={`language-button ${language === 'fr' ? 'active' : ''}`}
            onClick={() => handleLanguageClick('fr')}
          >
            Français
          </button>
          <button
            className={`language-button ${language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageClick('en')}
          >
            English
          </button>
        </div>

        <img src="/logo.png" alt="Logo" className="admin-logo" />
      </div>

      <div className="admin-appel-content">
        <div className="reservation-info">
          <div className="icon-chair">
            <img src="/chairImage.png" alt="Chair Full" />
          </div>
          <p className="reservation-time">
            {language === 'ar' ? 'الوقت:' : 
             language === 'fr' ? 'Créneau:' : 
             'Time Slot:'} {timeSlot}, {language === 'ar' ? 'التاريخ:' : 
             language === 'fr' ? 'Date:' : 
             'Date:'} {new Date(date).toLocaleDateString()}
          </p>
          {reservation.partySize && (
            <p className="party-size">
              {language === 'ar' ? 'عدد الأشخاص:' : 
               language === 'fr' ? 'Nombre de personnes:' : 
               'Party Size:'} {reservation.partySize}
            </p>
          )}
        </div>

        <div className="client-info">
          <div className="info-field">
            <label>
              {language === 'ar' ? 'الاسم:' : 
               language === 'fr' ? 'Nom:' : 
               'Name:'}
            </label>
            <span>{userName}</span>
          </div>
          <div className="info-field">
            <label>
              {language === 'ar' ? 'الهاتف:' : 
               language === 'fr' ? 'Téléphone:' : 
               'Phone:'}
            </label>
            <span>{userPhone}</span>
          </div>
        </div>

        <button 
          className="call-button" 
          onClick={handleCall}
          disabled={userPhone === (language === 'ar' ? 'غير متوفر' : 
                                  language === 'fr' ? 'Non disponible' : 
                                  'Not available')}
        >
          📞 {language === 'ar' ? 'اتصل بالعميل' : 
              language === 'fr' ? 'Appeler le client' : 
              'Call the client'}
        </button>
      </div>
    </div>
  );
};

export default AdminAppel;