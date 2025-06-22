import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/TallesAdmin.css";
import ModalConfirmacion from "../components/ModalConfirmacion";
import AdminNavbar from "../components/AdminNavbar";
import AdminHomeButton from "../components/AdminHomeButton";
import axios from "axios";

const TallesAdmin = () => {
  const [talles, setTalles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalConfirm, setModalConfirm] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Traer talles
  const fetchTalles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/talles");
      setTalles(res.data);
    } catch (error) {
      toast.error("Error al cargar los talles");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTalles();
  }, []);

  // Agregar talle
  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nombre) return;
    try {
      const res = await axios.post("http://localhost:3000/api/talles", {
        nombre,
      });
      if (res.status === 201) {
        toast.success("¡Talle agregado!");
        setNombre("");
        fetchTalles();
      }
    } catch (error) {
      console.log(error.response);
      if (error.response && error.response.status === 409) {
        toast.error("Este talle ya existe.");
      } else {
        toast.error("Error al agregar el talle");
      }
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleEliminar = (id, nombre_talle) => {
    setModalConfirm({ open: true, id, nombre: nombre_talle });
  };

  // Confirmar eliminación
  const confirmarEliminar = async () => {
    const id = modalConfirm.id;
    setModalConfirm({ open: false, id: null, nombre: "" });
    try {
      const res = await axios.delete(`http://localhost:3000/api/talles/${id}`);
      toast.success("¡Talle eliminado!");
      fetchTalles();
    } catch (error) {
      const data = error.response?.data;
      if (data?.productos && data.productos.length > 0) {
        toast.error(
          `No puedes eliminar el talle porque está asociado a los siguientes productos: ${data.productos.join(
            ", "
          )}`
        );
      } else {
        toast.error(data.error || "Error al eliminar el talle");
      }
      return;
    }
  };
  return (
    <div className="talles-admin-bg">
      <AdminNavbar />
      <ModalConfirmacion
        isOpen={modalConfirm.open}
        onClose={() => setModalConfirm({ open: false, id: null, nombre: "" })}
        onConfirm={confirmarEliminar}
        mensaje={`¿Estás seguro que deseas eliminar el talle "${modalConfirm.nombre}"?`}
        titulo="Eliminar talle"
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
      />
      <div className="talles-admin-back-btn-wrapper">
        <AdminHomeButton />
      </div>
      <div className="talles-admin-container">
        
        <h2 className="talles-admin-title">Administrar Talles</h2>
        <form onSubmit={handleAgregar} className="talles-admin-form">
          <input
            className="talles-admin-input"
            placeholder="Nombre del talle"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <button type="submit" className="talles-admin-btn-agregar">
            Agregar Talle
          </button>
        </form>
        <h3 className="talles-admin-subtitle">Talles existentes</h3>
        {loading ? (
          <p className="talles-admin-loading">Cargando...</p>
        ) : (
          <ul className="talles-admin-list">
            {talles.map((talle) => (
              <li key={talle.id_talle} className="talles-admin-item">
                <div className="talles-admin-item-info">
                  <span className="talles-admin-item-nombre">
                    {talle.nombre_talle}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleEliminar(talle.id_talle, talle.nombre_talle)
                  }
                  className="talles-admin-btn-eliminar"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TallesAdmin;
