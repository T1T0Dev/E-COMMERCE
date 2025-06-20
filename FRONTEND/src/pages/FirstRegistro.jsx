import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
    if (!form.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    if (!form.direccion.trim()) newErrors.direccion = "La dirección es obligatoria";
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (
      !/^(\+?\d{1,4}[-\s]?)?(\d{2,4}[-\s]?){2,4}\d{2,4}$/.test(form.telefono.trim())
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

  const validarTelefonoExiste = async (telefono) => {
    if (!telefono.trim()) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/auth/telefono-existe/${encodeURIComponent(telefono.trim())}`
      );
      if (res.data.exists) {
        setErrores((prev) => ({
          ...prev,
          telefono: "Este número de teléfono ya está vinculado a una cuenta.",
        }));
        return false;
      }
    } catch (e) {
      setErrores((prev) => ({
        ...prev,
        telefono: "Este número de teléfono ya está vinculado a una cuenta.",
      }));
      return false;
    }
    return true;
  };

  const handleBlurTelefono = async (e) => {
    await validarTelefonoExiste(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    const telefonoOk = await validarTelefonoExiste(form.telefono);
    if (!telefonoOk) return;
    sessionStorage.setItem("registroCliente", JSON.stringify(form));
    navigate("/second-registro");
  };

  return (
    <div className="firstreg-bg">
      <div className="firstreg-card">
        <h2 className="firstreg-title">Registro - Datos Personales</h2>
        <form className="firstreg-form" onSubmit={handleSubmit}>
          <div className="firstreg-field">
            <label className="firstreg-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              className="firstreg-input"
              id="nombre"
              name="nombre"
              placeholder="Nombre/s"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            {errores.nombre && (
              <span className="firstreg-error">{errores.nombre}</span>
            )}
          </div>
          <div className="firstreg-field">
            <label className="firstreg-label" htmlFor="apellido">
              Apellido
            </label>
            <input
              className="firstreg-input"
              id="apellido"
              name="apellido"
              placeholder="Apellido/s"
              value={form.apellido}
              onChange={handleChange}
              required
            />
            {errores.apellido && (
              <span className="firstreg-error">{errores.apellido}</span>
            )}
          </div>
          <div className="firstreg-field">
            <label className="firstreg-label" htmlFor="direccion">
              Dirección
            </label>
            <input
              className="firstreg-input"
              id="direccion"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
            />
            {errores.direccion && (
              <span className="firstreg-error">{errores.direccion}</span>
            )}
          </div>
          <div className="firstreg-field">
            <label className="firstreg-label" htmlFor="telefono">
              Teléfono
            </label>
            <input
              className="firstreg-input"
              id="telefono"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              onBlur={handleBlurTelefono}
              required
            />
            {errores.telefono && (
              <span className="firstreg-error">{errores.telefono}</span>
            )}
          </div>
          <button className="firstreg-btn" type="submit">
            Siguiente<span className="firstreg-arrow-icon">↗</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstRegistro;