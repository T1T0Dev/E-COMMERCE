import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import "./styles/EditClient.css";
import defaultProfile from "../assets/default-profile.jpg"; // Usa una imagen por defecto
import {ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditClient = () => {
  const user = useAuthStore((state) => state.user); // { id_usuario, rol }
  const [cliente, setCliente] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    contraseña: "",
  });
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  // Cargar datos del cliente y usuario
  useEffect(() => {
    if (!user) return;
    // 1. Obtener cliente por id_usuario
    axios.get(`http://localhost:3000/api/clientes`).then((res) => {
      // Busca el cliente que corresponde al usuario logueado
      const cli = res.data.find((c) => c.id_usuario === user.id_usuario);
      setCliente(cli);
      if (cli) {
        setForm((f) => ({
          ...f,
          nombre: cli.nombre || "",
          apellido: cli.apellido || "",
          direccion: cli.direccion || "",
          telefono: cli.telefono || "",
        }));
      }
    });
    // 2. Obtener usuario
    axios
      .get(`http://localhost:3000/api/usuarios/${user.id_usuario}`)
      .then((res) => {
        setUsuario(res.data);
        setForm((f) => ({
          ...f,
          email: res.data.email || "",
          contraseña: "",
        }));
      });
  }, [user]);

  // Preview de la foto
  useEffect(() => {
    if (!foto) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(foto);
  }, [foto]);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar cambio de foto
  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSaveCliente = async (e) => {
    e.preventDefault();
    if (!cliente) return;
    try {
      await axios.put(
        `http://localhost:3000/api/clientes/${cliente.id_cliente}`,
        {
          nombre: form.nombre,
          apellido: form.apellido,
          direccion: form.direccion,
          telefono: form.telefono,
        }
      );
      toast.success("Datos personales actualizados");
    } catch (error) {
      toast.error("Error al actualizar los datos personales");
    }
  };

  const handleSaveUsuario = async (e) => {
    e.preventDefault();
    if (!usuario) return;
    try {
      await axios.put(
        `http://localhost:3000/api/usuarios/${usuario.id_usuario}`,
        {
          email: form.email,
          contraseña: form.contraseña,
        }
      );
      toast.success("Datos de usuario actualizados");
    } catch (error) {
      toast.error("Error al actualizar los datos de usuario");
    }
  };

  // Subir foto de perfil
  const handleUploadFoto = async (e) => {
    e.preventDefault();
    if (!foto || !cliente) return;
    const data = new FormData();
    data.append("foto", foto);
    await axios.post(
      `http://localhost:3000/api/clientes/${cliente.id_cliente}/foto`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    toast.success("Foto de perfil actualizada");
    window.location.reload();
  };

  if (!cliente || !usuario) return <div>Cargando...</div>;

  return (
    <div className="editcliente-main">
      <div className="editcliente-panel-izq">
        <div className="editcliente-foto-wrapper">
          <img
            src={
              preview
                ? preview
                : cliente.foto_perfil
                ? `http://localhost:3000/${cliente.foto_perfil}`
                : defaultProfile
            }
            alt="Foto de perfil"
            className="editcliente-foto"
          />
        </div>
        <form onSubmit={handleUploadFoto} className="editcliente-foto-form">
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="editcliente-foto-input"
          />
          <button type="submit" className="editcliente-foto-btn">
            Cambiar foto
          </button>
        </form>
      </div>
      <div className="editcliente-panel-der">
        <form className="editcliente-form" onSubmit={handleSaveCliente}>
          <h2>Datos personales</h2>
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
          <label>Apellido</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
          />
          <label>Dirección</label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
          />
          <label>Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
          <button type="submit" className="editcliente-btn">
            Guardar cambios
          </button>
        </form>
        <form className="editcliente-form" onSubmit={handleSaveUsuario}>
          <h2>Datos de usuario</h2>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
          <label>Contraseña</label>
          <input
            name="contraseña"
            type="password"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Nueva contraseña"
          />
          <button type="submit" className="editcliente-btn">
            Guardar cambios
          </button>
        </form>
      </div>
        <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditClient;
