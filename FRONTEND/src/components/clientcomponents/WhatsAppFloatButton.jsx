import React from "react";
import whatsappIcon from "../../Resources/icon-whatsapp.jpeg";
import './estiloscliente/WhatsAppFloatButton.css';

const whatsappNumber = "543815941635"; // Cambia por tu número si lo deseas

const WhatsAppFloatButton = () => {
  const handleClick = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola! 👋 Quiero hacer una consulta.")}`,
      "_blank"
    );
  };

  return (
    <button
      className="whatsapp-float-btn"
      onClick={handleClick}
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <img
        src={whatsappIcon}
        alt="WhatsApp"
        className="whatsapp-float-img"
        draggable={false}
      />
    </button>
  );
};

export default WhatsAppFloatButton;