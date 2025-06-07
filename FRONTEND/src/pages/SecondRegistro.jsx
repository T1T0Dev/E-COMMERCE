import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Registros.css"

const SecondRegistro = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
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
        ...cliente,
        rol: "cliente"
      });
      sessionStorage.removeItem("registroCliente");
      toast.success("Usuario registrado correctamente");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <div className="registro-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="registro-card">
        <h2 className="registro-title">Registro - Usuario</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <label className="registro-label" htmlFor="email">Email</label>
          <input
            className="registro-input"
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label className="registro-label" htmlFor="password">Contraseña</label>
          <input
            className="registro-input"
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="registro-btn" type="submit">Registrarme</button>
        </form>
      </div>
    </div>
  );
};

export default SecondRegistro;