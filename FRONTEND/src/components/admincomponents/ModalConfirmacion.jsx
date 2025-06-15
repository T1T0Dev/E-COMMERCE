import React from "react";
import "./estilosadmin/ModalConfirmacion.css";

const ModalConfirmacion = ({ open, mensaje, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-confirm-overlay">
      <div className="modal-confirm-content">
        <p>{mensaje}</p>
        <div className="modal-confirm-actions">
          <button className="modal-confirm-btn modal-confirm-btn-si" onClick={onConfirm}>
            Sí
          </button>
          <button className="modal-confirm-btn modal-confirm-btn-no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;