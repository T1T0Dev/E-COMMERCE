import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import PasswordInput from "../components/PasswordInput";
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
        contraseña: form.password,
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
    <div className="secondreg-bg">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="secondreg-card">
        <h2 className="secondreg-title">Registro - Usuario</h2>
        <form className="secondreg-form" onSubmit={handleSubmit}>
          <label className="secondreg-label" htmlFor="email"></label>
          <input
            className="secondreg-input"
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          {errores.email && (
            <span className="secondreg-error">{errores.email}</span>
          )}

          <div className="secondreg-password-input-wrapper">
            <label className="secondreg-label" htmlFor="password"></label>
            <PasswordInput
              className="secondreg-input"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              error={errores.password}
            />
          </div>
          <button className="secondreg-btn" type="submit">
            Registrarme<span className="secondreg-arrow-icon">↗</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecondRegistro;