import React, { useEffect, useState } from "react";
import axios from "axios";
import "./estilosadmin/UsersCrud.css";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ModalConfirmacion from "./ModalConfirmacion";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  email: "",
  contraseña: "",
  rol: "",
};

const UsersCrud = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    action: null,
    usuario: null,
  });
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Estado para errores de validación
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
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    // Validación de contraseña mínima
    if (!editId && form.contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (editId && form.contraseña && form.contraseña.length > 0 && form.contraseña.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/usuarios/${editId}`, form);
        toast.success("Usuario actualizado");
      } else {
        await axios.post("http://localhost:3000/api/usuarios", form);
        toast.success("Usuario creado");
      }
      setForm(initialForm);
      setEditId(null);
      fetchUsuarios();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("El email ya está registrado.");
      } else {
        toast.error("Error al guardar usuario");
      }
    }
  };

  // Editar usuario (abre modal de confirmación)
  const handleEdit = (usuario) => {
    setModal({
      open: true,
      action: "editar",
      usuario,
    });
  };

  // Confirmar edición
  const confirmEdit = () => {
    setForm({
      email: modal.usuario.email,
      contraseña: "",
      rol: modal.usuario.rol,
    });
    setEditId(modal.usuario.id_usuario);
    setModal({ open: false, action: null, usuario: null });
  };

  // Eliminar usuario (abre modal de confirmación)
  const handleDelete = (id) => {
    setModal({
      open: true,
      action: "eliminar",
      usuario: id,
    });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${modal.usuario}`);
      toast.success("Usuario eliminado");
      fetchUsuarios();
    } catch (err) {
      toast.error("Error al eliminar usuario");
    } finally {
      setModal({ open: false, action: null, usuario: null });
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    setError("");
  };

  // Cerrar modal
  const closeModal = () =>
    setModal({ open: false, action: null, usuario: null });

  return (
    <div className="userscrud-bg">
      <div className="userscrud-back-btn-wrapper">
        <button onClick={() => navigate(-1)} className="cta-button">
          <AiOutlineArrowLeft size={30} className="drop-shadow" />
          Volver atrás
        </button>
      </div>
      <div className="userscrud-container">
        <ToastContainer position="top-right" autoClose={2000} />
        <ModalConfirmacion
          isOpen={modal.open}
          onClose={closeModal}
          onConfirm={
            modal.action === "eliminar"
              ? confirmDelete
              : modal.action === "editar"
              ? confirmEdit
              : closeModal
          }
          mensaje={
            modal.action === "eliminar"
              ? "¿Estás seguro de eliminar este usuario?"
              : modal.action === "editar"
              ? "¿Estás seguro de editar este usuario?"
              : ""
          }
          titulo={
            modal.action === "eliminar"
              ? "Eliminar usuario"
              : modal.action === "editar"
              ? "Editar usuario"
              : ""
          }
          textoConfirmar={
            modal.action === "eliminar"
              ? "Sí, eliminar"
              : modal.action === "editar"
              ? "Sí, editar"
              : "Confirmar"
          }
          textoCancelar="Cancelar"
        />

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
            placeholder="Nueva Contraseña"
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
            <button
              className="userscrud-btn-cancelar"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}
          {error && (
            <span className="userscrud-error" style={{ color: "red", marginTop: "8px", display: "block" }}>
              {error}
            </span>
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
                <th>Contraseña</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.contraseña}</td>
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
    </div>
  );
};

export default UsersCrud;