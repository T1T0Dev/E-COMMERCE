import React, { useState } from "react";
import './estiloscliente/ModalEnvio.css';

const ModalEnvio = ({ open, onClose, onConfirm, direccionCliente }) => {
  const [requiereEnvio, setRequiereEnvio] = useState(null); // null = no eligió
  const [usarDireccionCliente, setUsarDireccionCliente] = useState(true);
  const [direccionEnvio, setDireccionEnvio] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    setError("");
    if (requiereEnvio === null) {
      setError("Debes seleccionar si deseas envío a domicilio o no.");
      return;
    }
    if (requiereEnvio) {
      if (!usarDireccionCliente && !direccionEnvio.trim()) {
        setError("Por favor ingresa la dirección de envío.");
        return;
      }
    }
    onConfirm({
      requiereEnvio,
      direccionEnvio: requiereEnvio
        ? (usarDireccionCliente ? direccionCliente : direccionEnvio)
        : null,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-envio">
        <h3>¿Deseas envío a domicilio?</h3>
        <label>
          <input
            type="radio"
            checked={requiereEnvio === true}
            onChange={() => setRequiereEnvio(true)}
          />
          Sí, quiero envío
        </label>
        <label>
          <input
            type="radio"
            checked={requiereEnvio === false}
            onChange={() => setRequiereEnvio(false)}
          />
          No, retiro personalmente
        </label>
        {requiereEnvio === true && (
          <div>
            <label>
              <input
                type="radio"
                checked={usarDireccionCliente}
                onChange={() => setUsarDireccionCliente(true)}
              />
              Usar mi dirección registrada: <b>{direccionCliente}</b>
            </label>
            <br />
            <label>
              <input
                type="radio"
                checked={!usarDireccionCliente}
                onChange={() => setUsarDireccionCliente(false)}
              />
              Enviar a otra dirección
            </label>
            {!usarDireccionCliente && (
              <input
                type="text"
                placeholder="Dirección de envío"
                value={direccionEnvio}
                onChange={(e) => setDireccionEnvio(e.target.value)}
              />
            )}
          </div>
        )}
        {error && (
          <div style={{ color: "#ff4d4f", marginBottom: 8, marginTop: 4 }}>
            {error}
          </div>
        )}
        <div>
          <button onClick={handleConfirm} className="carrito-btn-enviar">
            Confirmar
          </button>
          <button onClick={onClose} className="carrito-btn-cerrar">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEnvio;