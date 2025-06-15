import React, { useEffect, useState } from "react";
import "./estilosadmin/CategoriasAdmin.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    const res = await fetch("http://localhost:3000/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    if (res.ok) {
      toast.success("¡Categoría agregada!");
      setNombre("");
      fetchCategorias();
    } else {
      toast.error("Error al agregar la categoría");
    }
  };

  // Eliminar categoría
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    const res = await fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Error al eliminar la categoría");
      return;
    }
    toast.success("¡Categoría eliminada!");
    fetchCategorias();
  };

  return (
    <div className="categorias-admin-bg">
      <div className="categorias-admin-back-btn-wrapper">
        <button onClick={() => navigate(-1)} className="cta-button">
          <AiOutlineArrowLeft size={30} className="drop-shadow" />
          Volver atrás
        </button>
      </div>
      <div className="categorias-admin-container">
        <ToastContainer position="top-right" autoClose={2000} />
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
                  onClick={() => handleEliminar(cat.id_categoria)}
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
