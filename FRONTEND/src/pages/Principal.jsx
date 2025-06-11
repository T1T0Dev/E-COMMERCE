import React, { useState } from "react";
import Header from "../components/clientcomponents/Header.jsx";
import Footer from "../components/clientcomponents/Footer.jsx";
import ScrollToTopButton from "../components/clientcomponents/ScrollToTopButton.jsx";
import Carruselprod from "../components/clientcomponents/Carruselprod.jsx";
import "./styles/Principal.css";
import useAuthStore from '../store/useAuthStore.js'
import ModalEmprendimiento from "./ModalSaberMas.jsx";

const Principal = () => {
  const user = useAuthStore((state) => state.user);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const enviarWhatsApp = (e) => {
    e.preventDefault();

    const texto =
      `¡Hola! 👋 Me gustaría ponerme en contacto con ustedes.\n
      ------------------------------------\n
      %20%F0%9F%91%A4 Nombre: ${nombre}\n
      📧 Correo: ${correo}\n
      📝 Asunto: ${asunto}\n
      💬 Mensaje:\n${mensaje}\n
      ------------------------------------\n
      ¡Espero su respuesta! 👏🏻`;

    const telefono = "543815941635";
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");
  };

  return (
    <div id="home">
      <Header />
      <main>
        <div className="landing-content" id="services">
          <section className="hero-section">
            <h1>
              BIENVENID@ <span className="landing-nombre-cliente">{user?.nombre}</span> A DREKKZ INDUMENTARIA
            </h1>
            <h2>DONDE EL ESTILO ROMPE LAS REGLAS</h2>
          
            <p>Descubre más sobre nuestros servicios y productos.</p>
            <button
              className="cta-button3"
              onClick={() => setModalOpen(true)}
            >
              SABER MAS <span className="arrow-icon">↗</span>
            </button>
          </section>

          <section className="features-section">
            <div className="feature">
              <img src="src/Resources/disenio.jpg" alt="Calidad" />
              <h2>Calidad</h2>
              <p>Ofrecemos productos de la más alta calidad.</p>
            </div>
            <div className="feature">
              <img src="src/Resources/medidas.jpg" alt="Medidas" />
              <h2>Medidas</h2>
              <p>Nos mantenemos a la vanguardia de la tecnología.</p>
            </div>
            <div className="feature">
              <img src="src/Resources/ime1.jpg" alt="Envios" />
              <h2>Envios</h2>
              <p>Estamos aquí para ayudarte en cada paso.</p>
            </div>
          </section>

          <Carruselprod />
<section className="contact-section" id="contact-section">
  <div className="contact-wrapper">
    <div className="contact-form">
      <h2>Contáctanos</h2>
      <p>¿Tienes preguntas? ¡Estamos aquí para ayudarte!</p>
      <form onSubmit={enviarWhatsApp}>
        <input
          type="text"
          placeholder="Tu Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Tu Correo Electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        />
        <textarea
          placeholder="Tu Mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
    <div className="contact-logo">
      <img src="src/Resources/logo-drekkz1.png" alt="Logo DREKKZ" />
    </div>
  </div>
</section>
          <ModalEmprendimiento open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Principal;
