import React from "react";
import "./styles/ModalConfirmacion.css";

const ModalConfirmacion = ({
  isOpen,
  mensaje,
  onConfirm,
  onClose,
  titulo = "Confirmar acción",
  textoConfirmar = "Sí",
  textoCancelar = "No"
}) => {
  if (!isOpen) return null;
  return (
    <div className="modal-confirm-overlay">
      <div className="modal-confirm-content">
        <h3 style={{marginTop:0}}>{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal-confirm-actions">
          <button className="modal-confirm-btn modal-confirm-btn-si" onClick={onConfirm}>
            {textoConfirmar}
          </button>
          <button className="modal-confirm-btn modal-confirm-btn-no" onClick={onClose}>
            {textoCancelar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;