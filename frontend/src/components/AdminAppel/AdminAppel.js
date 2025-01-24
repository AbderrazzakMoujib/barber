import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import "./AdminAppel.css";
import AdminAvatarDropdown from "../Admin_AvatarDropdown/AdminAvatarDropdown";
import { toast } from "react-toastify";

const AdminAppel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useContext(Context);
  const { reservation, date, timeSlot } = location.state || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCall = () => {
    const phoneNumber = 
      reservation?.user?.phone || 
      reservation?.phone || 
      "Non disponible";
    
    if (phoneNumber !== "Non disponible") {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast.error("Numéro de téléphone non disponible");
    }
  };

  if (!reservation) {
    return <div className="admin-appel">Aucune information de réservation disponible</div>;
  }

  const userName = reservation.user?.name || "Non disponible";
  const userPhone = reservation.user?.phone || "Non disponible";

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
        <img src="/logo.png" alt="Logo" className="admin-logo" />
      </div>

      <div className="admin-appel-content">
        <div className="reservation-info">
          <div className="icon-chair">
            <img src="/chairImage.png" alt="Chair Full" />
          </div>
          <p className="reservation-time">
            Créneau: {timeSlot}, Date: {new Date(date).toLocaleDateString()}
          </p>
          {reservation.partySize && (
            <p className="party-size">
              Nombre de personnes: {reservation.partySize}
            </p>
          )}
        </div>

        <div className="client-info">
          <div className="info-field">
            <label>Nom:</label>
            <span>{userName}</span>
          </div>
          <div className="info-field">
            <label>Téléphone:</label>
            <span>{userPhone}</span>
          </div>
        </div>

        <button 
          className="call-button" 
          onClick={handleCall}
          disabled={userPhone === "Non disponible"}
        >
          📞 Appeler le client
        </button>
      </div>
    </div>
  );
};

export default AdminAppel;