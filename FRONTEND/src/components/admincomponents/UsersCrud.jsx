import React, { useEffect, useState } from "react";
import axios from "axios";
import "./estilosadmin/UsersCrud.css";
import { toast, ToastContainer } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import ModalConfirmacion from "./ModalConfirmacion";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./AdminNavbar";
import AdminHomeButton from "./AdminHomeButton";

const initialForm = {
  email: "",
  contraseña: "",
  rol: "",
};

const UsersCrud = () => {
  const [filtroRol, setFiltroRol] = useState("admin");
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    action: null,
    usuario: null,
  });

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const usuariosFiltrados = usuarios.filter(u =>
    filtroRol === "Todos" ? true : u.rol === filtroRol
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!editId && form.contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (
      editId &&
      form.contraseña &&
      form.contraseña.length > 0 &&
      form.contraseña.length < 6
    ) {
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

  const handleEdit = (usuario) => {
    setModal({
      open: true,
      action: "editar",
      usuario,
    });
  };

  const confirmEdit = () => {
    setForm({
      email: modal.usuario.email,
      contraseña: "",
      rol: modal.usuario.rol,
    });
    setEditId(modal.usuario.id_usuario);
    setModal({ open: false, action: null, usuario: null });
  };

  const handleDelete = (id) => {
    setModal({
      open: true,
      action: "eliminar",
      usuario: id,
    });
  };

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

  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    setError("");
  };

  const closeModal = () =>
    setModal({ open: false, action: null, usuario: null });

  return (
    <div className="userscrud-bg">
      <div className="userscrud-navbar">
        <AdminNavbar />
      </div>
      <div className="userscrud-back-btn-wrapper">
        <AdminHomeButton />
      </div>
      <div className="userscrud-content">
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

        {/* Switch de filtro */}
        <div className="userscrud-switch-wrapper" style={{ marginBottom: 24 }}>
          <span
            className={filtroRol === "admin" ? "switch-label active" : "switch-label"}
            onClick={() => setFiltroRol("admin")}
            style={{ cursor: "pointer" }}
          >
            Admins
          </span>
          <label className="switch-toggle">
            <input
              type="checkbox"
              checked={filtroRol === "cliente"}
              onChange={() =>
                setFiltroRol(filtroRol === "admin" ? "cliente" : "admin")
              }
            />
            <span className="slider"></span>
          </label>
          <span
            className={filtroRol === "cliente" ? "switch-label active" : "switch-label"}
            onClick={() => setFiltroRol("cliente")}
            style={{ cursor: "pointer" }}
          >
            Clientes
          </span>
        </div>

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
            <span
              className="userscrud-error"
              style={{
                color: "red",
                marginTop: "8px",
                display: "block",
              }}
            >
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
                {/* Solo muestra la columna Cliente si el filtro NO es admin */}
                {filtroRol !== "admin" && <th>Cliente</th>}
                <th>Email</th>
                <th>Contraseña</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  {/* Solo muestra la celda Cliente si el filtro NO es admin */}
                  {filtroRol !== "admin" && (
                    <td>
                      {usuario.rol === "cliente" ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {usuario.foto_perfil ? (
                            <img
                              src={
                                usuario.foto_perfil.startsWith("http")
                                  ? usuario.foto_perfil
                                  : `http://localhost:3000${usuario.foto_perfil}`
                              }
                              alt={usuario.nombre}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginRight: 6,
                              }}
                            />
                          ) : (
                            <FaUserCircle size={32} style={{ marginRight: 6, color: "#ededed" }} />
                          )}
                          {usuario.nombre} {usuario.apellido}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  )}
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