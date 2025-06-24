import whatsappIcon from "../Resources/icon-whatsapp.jpeg";
import './styles/WhatsAppFloatButton.css';

const whatsappNumber = "543815941635"; // Cambia por tu número si lo deseas

const WhatsAppFloatButton = () => {

  const handleClick = () => {
    window.open(
      `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent("¡Hola Jorge! Quiero hacer una consulta.")}`,
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