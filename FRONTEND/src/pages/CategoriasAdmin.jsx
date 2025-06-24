import React, { useEffect, useState } from "react";
import "./styles/CategoriasAdmin.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirmacion from "../components/ModalConfirmacion";
import AdminNavbar from "../components/AdminNavbar";
import AdminHomeButton from "../components/AdminHomeButton";
import axios from "axios";

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalConfirm, setModalConfirm] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Traer categorías
  const fetchCategorias = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3000/api/categorias");
    const data = await res.json();
    setCategorias(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Agregar categoría
  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nombre) return;
    try {
      const res = await axios.post("http://localhost:3000/api/categorias", {
        nombre,
      });
      if (res.status === 201) {
        toast.success("¡Categoría agregada!");
        setNombre("");
        fetchCategorias();
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Esta categoria ya existe.");
      } else {
        toast.error("Error al agregar la categoria");
      }
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleEliminar = (id, nombre_categoria) => {
    setModalConfirm({ open: true, id, nombre: nombre_categoria });
  };

  // Confirmar eliminación
  const confirmarEliminar = async () => {
    const id = modalConfirm.id;
    setModalConfirm({ open: false, id: null, nombre: "" });
    const res = await fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.productos && data.productos.length > 0) {
        toast.error(
          `No puedes eliminar la categoría porque está asociada a los siguientes productos activos: ${data.productos.join(
            ", "
          )}`
        );
      } else {
        toast.error(data.error || "Error al eliminar la categoría");
      }
      return;
    }
    toast.success("¡Categoría eliminada!");
    fetchCategorias();
  };

  return (
    <div className="categorias-admin-bg">
      <AdminNavbar />
      <ModalConfirmacion
        isOpen={modalConfirm.open}
        onClose={() => setModalConfirm({ open: false, id: null, nombre: "" })}
        onConfirm={confirmarEliminar}
        mensaje={`¿Estás seguro que deseas eliminar la categoría "${modalConfirm.nombre}"?`}
        titulo="Eliminar categoría"
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
      />
      <div className="categorias-admin-back-btn-wrapper">
        <AdminHomeButton />
      </div>
      <div className="categorias-admin-container">
        <h2 className="categorias-admin-title">Administrar Categorías</h2>
        <form onSubmit={handleAgregar} className="categorias-admin-form">
          <input
            className="categorias-admin-input"
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <button type="submit" className="categorias-admin-btn-agregar">
            Agregar Categoría
          </button>
        </form>
        <h3 className="categorias-admin-subtitle">Categorías existentes</h3>
        {loading ? (
          <p className="categorias-admin-loading">Cargando...</p>
        ) : (
          <ul className="categorias-admin-list">
            {categorias.map((cat) => (
              <li key={cat.id_categoria} className="categorias-admin-item">
                <div className="categorias-admin-item-info">
                  <span className="categorias-admin-item-nombre">
                    {cat.nombre_categoria || cat.nombre}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleEliminar(
                      cat.id_categoria,
                      cat.nombre_categoria || cat.nombre
                    )
                  }
                  className="categorias-admin-btn-eliminar"
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

export default CategoriasAdmin;
