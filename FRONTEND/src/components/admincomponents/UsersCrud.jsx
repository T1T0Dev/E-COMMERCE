import React, { useEffect, useState } from "react";
import axios from "axios";
import "./estilosadmin/UsersCrud.css";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const initialForm = {
  email: "",
  contraseña: "",
  rol: "",
};

const UsersCrud = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Traer usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Manejar cambios de formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear o editar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/usuarios/${editId}`, form);
        toast.success("Usuario actualizado");
      } else {
        await axios.post("http://localhost:3000/api/auth/register", form);
        toast.success("Usuario creado");
      }
      setForm(initialForm);
      setEditId(null);
      fetchUsuarios();
    } catch (err) {
      toast.error("Error al guardar usuario");
    }
  };

  // Editar usuario
  const handleEdit = (usuario) => {
    setForm({
      email: usuario.email,
      contraseña: "",
      rol: usuario.rol,
    });
    setEditId(usuario.id_usuario);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`);
      toast.success("Usuario eliminado");
      fetchUsuarios();
    } catch (err) {
      toast.error("Error al eliminar usuario");
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
  };

  return (
    <div className="userscrud-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <button onClick={() => navigate(-1)} className="cta-button">
        <AiOutlineArrowLeft size={30} className="drop-shadow" />
        Volver atrás
      </button>
      <h2 className="userscrud-title">Administrar Usuarios</h2>
      <form className="userscrud-form" onSubmit={handleSubmit}>
        <input
          className="userscrud-input"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="userscrud-input"
          name="contraseña"
          type="password"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          required={!editId}
        />
        <select
          className="userscrud-input"
          name="rol"
          value={form.rol}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar rol</option>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
        <button className="userscrud-btn-agregar" type="submit">
          {editId ? "Actualizar" : "Agregar"}
        </button>
        {editId && (
          <button className="userscrud-btn-cancelar" type="button" onClick={handleCancel}>
            Cancelar
          </button>
        )}
      </form>
      <h3 className="userscrud-subtitle">Usuarios existentes</h3>
      {loading ? (
        <div>Cargando usuarios...</div>
      ) : (
        <table className="userscrud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>
                  <button
                    className="userscrud-btn-editar"
                    onClick={() => handleEdit(usuario)}
                  >
                    Editar
                  </button>
                  <button
                    className="userscrud-btn-eliminar"
                    onClick={() => handleDelete(usuario.id_usuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersCrud;