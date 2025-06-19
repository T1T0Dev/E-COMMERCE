import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
    } else if (form.telefono.replace(/\D/g, "").length < 8) {
      newErrors.telefono = "El teléfono no es válido";
    }
    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  // Validación de teléfono único
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
        telefono: "Error al validar el teléfono.",
      }));
      return false;
    }
    return true;
  };

  const handleBlurTelefono = async (value) => {
    await validarTelefonoExiste(value);
  };

  const handlePhoneChange = (value) => {
    setForm({ ...form, telefono: value });
    setErrores((prev) => ({ ...prev, telefono: "" }));
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
    <div className="dual-bg-registro">
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
            <PhoneInput
              country={"ar"}
              value={form.telefono}
              onChange={handlePhoneChange}
              onBlur={() => handleBlurTelefono(form.telefono)}
              inputProps={{
                name: "telefono",
                required: true,
                autoFocus: false,
                className: "registro-input",
                autoComplete: "tel",
              }}
              inputStyle={{
                width: "100%",
                borderRadius: "12px",
                fontSize: "1.08rem",
                padding: "1.1rem 0rem 0.6rem 48px",
              }}
              masks={{ ar: '(..) ...-....' }}
              onlyCountries={['ar', 'br', 'uy', 'cl', 'py', 'bo', 'pe', 'co', 've', 'mx', 'us', 'es']}
              disableDropdown={false}
              enableSearch={true}
              disableCountryCode={false}
              disableCountryGuess={false}
              placeholder="Ej: 3811234567"
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