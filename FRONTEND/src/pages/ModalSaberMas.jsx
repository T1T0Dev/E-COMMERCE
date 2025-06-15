import React from "react";
import "./styles/ModalSaberMas.css";

const ModalSaberMas = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-saber-overlay">
      <div className="modal-saber-content">
        <button
          className="modal-saber-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <div className="modal-saber-header">
          <img
            src="src\Resources\logo.jpg"
            alt="Logo DREKKZ"
            className="modal-saber-logo"
          />
          <h2>
            Sobre{" "}
            <span className="modal-saber-highlight">DREKKZ INDUMENTARIA</span>
          </h2>
        </div>
        <p className="modal-saber-desc">
          <b>DREKKZ</b> es un emprendimiento apasionado por la moda urbana y la
          calidad.
          <br />
          Diseñamos y confeccionamos prendas únicas para quienes buscan destacar y
          romper las reglas del estilo tradicional.
        </p>
        <ul className="modal-saber-list">
          <li>✨ Productos de alta calidad y diseño exclusivo</li>
          <li>🤝 Atención personalizada</li>
          <li>🚚 Envíos a todo el país</li>
          <li>📲 ¡Seguinos en redes para enterarte de las novedades!</li>
        </ul>
        <a
          href="https://www.instagram.com/jorge.villagraa/"
          target="_blank"
          rel="noopener noreferrer"
          className="modal-saber-instagram-btn"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
            alt="Instagram"
            className="modal-saber-instagram-icon"
          />
          Seguinos en Instagram
        </a>
      </div>
    </div>
  );
};

export default ModalSaberMas;