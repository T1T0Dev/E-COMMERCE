import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuthStore from "../store/useAuthStore";
import Ojito from "../components/clientcomponents/Ojito";

import "react-toastify/dist/ReactToastify.css";
import "./styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errores, setErrores] = useState({});

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.setUser);

  const validarLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email inválido";
    if (!contraseña) newErrors.contraseña = "La contraseña es obligatoria";
    else if (contraseña.length < 6)
      newErrors.contraseña = "Mínimo 6 caracteres";
    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarLogin()) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          contraseña,
        }
      );
      useAuthStore.getState().setUser(response.data);

      if (response.data) {
        // Guarda el usuario con nombre en zustand y localStorage
        login(response.data);
        toast.success("Login exitoso");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Error al registrar usuario");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <ToastContainer />
        <h1 className="login-title">INICIA SESION</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label className="login-label" htmlFor="email">
              EMAIL
            </label>
            <input
              className="login-input"
              type="text"
              placeholder="Email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errores.email && (
              <span className="error-message">{errores.email}</span>
            )}
          </div>
          <div className="password-input-wrapper">
            <label className="login-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              id="password"
              name="password"
              required
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
            {errores.contraseña && (
              <span className="error-message">{errores.contraseña}</span>
            )}
            <Ojito
              visible={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              ariaLabel={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            />
          </div>
          <button className="login-btn" type="submit">
            Login<span className="arrow-icon">↗</span>
          </button>
        </form>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <span className="create-account">NO TIENES CUENTA? </span>
          <Link to="/register">CREA TU CUENTA GRATIS!</Link>
        </div>
      </div>
    </div>
  );
}
