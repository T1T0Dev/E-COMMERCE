import React from "react";
import "./styles/ModalGracias.css";

const ModalGracias = ({ open, onClose, mensaje }) => {
  if (!open) return null;

  return (
    <div className="modal-gracias-overlay">
      <div className="modal-gracias-content">
        <h2>¡Gracias por tu pedido!</h2>
        <p>{mensaje || "En breve nos estaremos comunicando contigo para coordinar la entrega. ¡Te esperamos de nuevo en Drekkz!"}</p>
        <button className="modal-gracias-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalGracias;