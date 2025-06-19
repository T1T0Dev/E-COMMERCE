import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";
import logoDrekkz from "../Resources/logo-drekkz1.png";
import PasswordInput from "../components/PasswordInput";
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
        { email, contraseña }
      );
      useAuthStore.getState().setUser(response.data);
      if (response.data) {
        login(response.data);
        toast.success("Login exitoso");
        sessionStorage.setItem("user", JSON.stringify(response.data));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="dual-bg-login">
      <img
        src={logoDrekkz}
        alt="Drekkz"
        className="drekkz-logo-login"
        draggable={false}
      />
      <div className="login-card">
        <h1 className="login-title">INICIA SESIÓN</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label className="login-label" htmlFor="email"></label>
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
            <label className="login-label" htmlFor="password"></label>
            <PasswordInput
              className="login-input"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              show={showPassword}
              setShow={setShowPassword}
            />
            {errores.contraseña && (
              <span className="error-message">{errores.contraseña}</span>
            )}
          </div>
          <button className="login-btn" type="submit">
            Login<span className="arrow-icon">↗</span>
          </button>
        </form>
        <div className="login-bottom-link">
          <span className="create-account">¿NO TIENES CUENTA? </span>
          <Link className="registro-link" to="/register">
            CREA TU CUENTA GRATIS!
          </Link>
        </div>
         <div className="login-recovery-password">
          <span className="password-recovery">¿OLVIDASTE TU CONTRASEÑA? </span>
          <a
            className="whatssapp-recovery"
            href="https://wa.me/543815941635?text=Me%20olvid%C3%A9%20mi%20contrase%C3%B1a%2C%20%C2%BFme%20puedes%20ayudar%3F"
            target="_blank"
            rel="noopener noreferrer"
          >
            ¡RECUPERA TU CONTRASEÑA POR WHATSAPP!
          </a>
        </div>

        
      </div>
      <ToastContainer />
    </div>
  );
}
