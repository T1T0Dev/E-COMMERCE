import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import PasswordInput from "../components/clientcomponents/PasswordInput";
import "react-toastify/dist/ReactToastify.css";
import "./styles/SecondRegistro.css";

const SecondRegistro = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validar = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El email no es válido";
    }
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    const cliente = JSON.parse(sessionStorage.getItem("registroCliente"));
    if (!cliente) {
      toast.error("Completa primero los datos personales");
      navigate("/register");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/auth/register-full", {
        ...form,
        contraseña: form.password, // corregido el nombre del campo
        ...cliente,
        rol: "cliente",
      });
      sessionStorage.removeItem("registroCliente");
      toast.success("Usuario registrado correctamente");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <div className="dual-bg-registro">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="registro-card">
        <h2 className="registro-title">Registro - Usuario</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <label className="registro-label" htmlFor="email">
          </label>
          <input
            className="registro-input"
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          {errores.email && (
            <span className="registro-error">{errores.email}</span>
          )}

          <div className="password-input-wrapper">
            <label className="registro-label" htmlFor="password">
            </label>
            <PasswordInput
              className="registro-input"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              error={errores.password}
            />
          </div>
          <button className="registro-btn" type="submit">
            Registrarme<span className="arrow-icon">↗</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecondRegistro;