import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./estilosadmin/AdminHomeButton.css";

const AdminHomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="admin-home-btn"
      onClick={() => navigate("/")}
      title="Ir a inicio"
    >
      <FaHome size={26} className="admin-home-icon" />
      <span className="admin-home-label">Inicio</span>
    </button>
  );
};

export default AdminHomeButton;