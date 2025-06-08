import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import useAuthStore from '../store/useAuthStore'; // Ajusta el path si es necesario

import "react-toastify/dist/ReactToastify.css";
import "./styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore(state => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password
      });

      if (response.data) {
        // Guarda el usuario en zustand y localStorage
        login(response.data);
        toast.success("Login exitoso");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      toast.error("Email o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <ToastContainer />
        <h1 className="login-title">Iniciar Sesion</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label className="login-label" htmlFor="email">Email</label>
            <input
              className="login-input"
              type="text"
              id="email"
              name="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="login-label" htmlFor="password">Password:</label>
            <input
              className="login-input"
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button className="login-btn" type="submit">Login<span className="arrow-icon">↗</span></button>
        </form>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <span className="create-account">No tienes cuenta? </span>
          <Link to="/register">Crea tu cuenta Gratis!</Link>
        </div>
      </div>
    </div>
  );
}