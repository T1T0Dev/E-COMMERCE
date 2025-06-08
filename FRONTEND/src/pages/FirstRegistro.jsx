import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Registros.css";

const FirstRegistro = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: ""
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    sessionStorage.setItem("registroCliente", JSON.stringify(form));
    navigate("/second-registro");
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2 className="registro-title">Registro - Datos Personales</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <label className="registro-label" htmlFor="nombre">Nombre</label>
          <input
            className="registro-input"
            id="nombre"
            name="nombre"
            placeholder="Nombre/s"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <label className="registro-label" htmlFor="apellido">Apellido</label>
          <input
            className="registro-input"
            id="apellido"
            name="apellido"
            placeholder="Apellido/s"
            value={form.apellido}
            onChange={handleChange}
            required
          />
          <label className="registro-label" htmlFor="direccion">Dirección</label>
          <input
            className="registro-input"
            id="direccion"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            required
          />
          <label className="registro-label" htmlFor="telefono">Teléfono</label>
          <input
            className="registro-input"
            id="telefono"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
          <button className="registro-btn" type="submit">Siguiente<span className="arrow-icon">↗</span></button>
        </form>
      </div>
    </div>
  );
};

export default FirstRegistro;