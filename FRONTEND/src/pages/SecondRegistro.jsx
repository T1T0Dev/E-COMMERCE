import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import PasswordInput from "../components/clientcomponents/PasswordInput";
import "react-toastify/dist/ReactToastify.css";
import "./styles/SecondRegistro.css";

const SecondRegistro = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cliente = JSON.parse(sessionStorage.getItem("registroCliente"));
    if (!cliente) {
      toast.error("Completa primero los datos personales");
      navigate("/register");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/auth/register-full", {
        ...form,
        contaseña: form.password,
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
      <div className="dual-bg-left"></div>
      <div className="dual-bg-right"></div>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="registro-card">
        <h2 className="registro-title">Registro - Usuario</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <label className="registro-label" htmlFor="email">
            Email
          </label>
          <input
            className="registro-input"
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          
          <div className="password-input-wrapper">
            <label className="registro-label" htmlFor="password">
              Contraseña
            </label>
            <PasswordInput
              className="registro-input"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              required
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
