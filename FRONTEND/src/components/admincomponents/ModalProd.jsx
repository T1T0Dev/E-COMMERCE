import React, { useState } from "react";
import "./estilosadmin/ModalProd.css";

const ModalProd = ({ isOpen, onClose, onProductCreated }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nombre_producto: "",
    descripcion: "",
    precio: "",
    id_categoria: "",
  });

  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagen) return alert("Selecciona una imagen");
    setLoading(true);

    const data = new FormData();
    data.append("nombre_producto", formData.nombre_producto);
    data.append("descripcion", formData.descripcion);
    data.append("precio", formData.precio);
    data.append("id_categoria", formData.id_categoria);
    data.append("imagen_producto", imagen);

    try {
      const res = await fetch("http://localhost:3000/api/productos/con-talles", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Producto creado correctamente");
        if (onProductCreated) onProductCreated();
        onClose();
      } else {
        alert("Error al crear producto: " + (result.error || "Error desconocido"));
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
          <h2 className="modal-title">Nuevo Producto</h2>
          <form className="modal-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="modal-form-group">
              <label className="modal-label">Nombre del producto</label>
              <input
                className="modal-input"
                type="text"
                name="nombre_producto"
                value={formData.nombre_producto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Descripción</label>
              <textarea
                className="modal-input"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Precio</label>
              <input
                className="modal-input"
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Categoría</label>
              <select
                className="modal-input"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  Seleccionar categoría
                </option>
                <option value="1">Buzo</option>
                <option value="2">Remera</option>
                <option value="3">Campera</option>
                <option value="4">Zapatillas</option>
                <option value="5">Pantalones</option>
                <option value="6">Medias</option>
                <option value="7">Sweater</option>
              </select>
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Imagen</label>
              <input
                className="modal-input"
                type="file"
                name="imagen_producto"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <button className="modal-submit" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalProd;