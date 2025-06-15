import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/FirstRegistro.css";

const FirstRegistro = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  });
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validar = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!form.apellido.trim())
      newErrors.apellido = "El apellido es obligatorio";
    if (!form.direccion.trim())
      newErrors.direccion = "La dirección es obligatoria";
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (
      !/^(\+?\d{1,4}[-\s]?)?(\d{2,4}[-\s]?){2,4}\d{2,4}$/.test(
        form.telefono.trim()
      )
    ) {
      newErrors.telefono = "El teléfono no es válido";
    }
    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    sessionStorage.setItem("registroCliente", JSON.stringify(form));
    navigate("/second-registro");
  };

  return (
    <div className="dual-bg-registro">
      <div className="dual-bg-left"></div>
      <div className="dual-bg-right"></div>
      <div className="registro-card">
        <h2 className="registro-title">Registro - Datos Personales</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="registro-field">
            <label className="registro-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              className="registro-input"
              id="nombre"
              name="nombre"
              placeholder="Nombre/s"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            {errores.nombre && (
              <span className="registro-error">{errores.nombre}</span>
            )}
          </div>
          <div className="registro-field">
            <label className="registro-label" htmlFor="apellido">
              Apellido
            </label>
            <input
              className="registro-input"
              id="apellido"
              name="apellido"
              placeholder="Apellido/s"
              value={form.apellido}
              onChange={handleChange}
              required
            />
            {errores.apellido && (
              <span className="registro-error">{errores.apellido}</span>
            )}
          </div>
          <div className="registro-field">
            <label className="registro-label" htmlFor="direccion">
              Dirección
            </label>
            <input
              className="registro-input"
              id="direccion"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />
            {errores.direccion && (
              <span className="registro-error">{errores.direccion}</span>
            )}
          </div>
          <div className="registro-field">
            <label className="registro-label" htmlFor="telefono">
              Teléfono
            </label>
            <input
              className="registro-input"
              id="telefono"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
            {errores.telefono && (
              <span className="registro-error">{errores.telefono}</span>
            )}
          </div>
          <button className="registro-btn" type="submit">
            Siguiente<span className="arrow-icon">↗</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstRegistro;