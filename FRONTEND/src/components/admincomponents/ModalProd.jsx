import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./estilosadmin/ModalProd.css";

const ModalProd = ({
  isOpen,
  onClose,
  onProductCreated,
  producto,
  categorias = [],
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nombre_producto: "",
    descripcion: "",
    precio: "",
    id_categoria: "",
  });
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  // NUEVO: talles disponibles y seleccionados
  const [talles, setTalles] = useState([]);
  const [tallesSeleccionados, setTallesSeleccionados] = useState({}); // { id_talle: cantidad }

  // Traer talles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3000/api/talles")
        .then((res) => res.json())
        .then((data) => setTalles(data));
    }
  }, [isOpen]);

  // Precargar datos si es edición
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre_producto: producto.nombre_producto,
        descripcion: producto.descripcion,
        precio: producto.precio,
        id_categoria: producto.id_categoria || "",
      });
      setImagen(null);

      // Precargar talles seleccionados si existen
      if (producto.talles && producto.talles.length > 0) {
        const tallesObj = {};
        producto.talles.forEach((t) => {
          tallesObj[t.id_talle] = t.stock;
        });
        setTallesSeleccionados(tallesObj);
      } else {
        setTallesSeleccionados({});
      }
    } else {
      setFormData({
        nombre_producto: "",
        descripcion: "",
        precio: "",
        id_categoria: "",
      });
      setImagen(null);
      setTallesSeleccionados({});
    }
  }, [producto, isOpen]);

  // Manejar cambios en los talles seleccionados
  const handleTalleChange = (id_talle, checked) => {
    setTallesSeleccionados((prev) => {
      const nuevo = { ...prev };
      if (checked) {
        nuevo[id_talle] = nuevo[id_talle] || 1; // valor por defecto 1
      } else {
        delete nuevo[id_talle];
      }
      return nuevo;
    });
  };

  const handleCantidadChange = (id_talle, cantidad) => {
    setTallesSeleccionados((prev) => ({
      ...prev,
      [id_talle]: cantidad,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!producto && !imagen) return toast.error("Selecciona una imagen");
    setLoading(true);

    const data = new FormData();
    data.append("nombre_producto", formData.nombre_producto);
    data.append("descripcion", formData.descripcion);
    data.append("precio", formData.precio);
    data.append("id_categoria", formData.id_categoria);
    if (imagen) data.append("imagen_producto", imagen);

    // Agregar talles seleccionados
    data.append(
      "talles",
      JSON.stringify(
        Object.entries(tallesSeleccionados).map(([id_talle, stock]) => ({
          id_talle: Number(id_talle),
          stock: Number(stock),
        }))
      )
    );

    try {
      const url = producto?.id_producto
        ? `http://localhost:3000/api/productos/${producto.id_producto}`
        : "http://localhost:3000/api/productos/con-talles";
      const method = producto?.id_producto ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          producto?.id_producto
            ? "Producto actualizado"
            : "Producto creado correctamente"
        );
        if (onProductCreated) onProductCreated();
        onClose();
      } else {
        toast.error(result.error || "Error");
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor");
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
          <h2 className="modal-title">
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <form
            className="modal-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="modal-grid">
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
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
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
              <label className="modal-label">Imagen</label>
              <input
                className="modal-input"
                type="file"
                name="imagen_producto"
                accept="image/*"
                onChange={handleFileChange}
                required={!producto}
              />
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Talles y stock</label>
              <div className="modal-talles-row">
                {talles.map((talle) => (
                  <label key={talle.id_talle} className="modal-talle-item">
                    <input
                      type="checkbox"
                      checked={tallesSeleccionados[talle.id_talle] !== undefined}
                      onChange={e =>
                        handleTalleChange(talle.id_talle, e.target.checked)
                      }
                    />
                    {talle.nombre_talle}
                    {tallesSeleccionados[talle.id_talle] !== undefined && (
                      <input
                        type="number"
                        min={1}
                        value={tallesSeleccionados[talle.id_talle]}
                        onChange={e =>
                          handleCantidadChange(talle.id_talle, e.target.value)
                        }
                        placeholder="Stock"
                        required
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="modal-submit" disabled={loading}>
              {loading
                ? producto
                  ? "Guardando..."
                  : "Agregando..."
                : producto
                ? "Guardar Cambios"
                : "Agregar Producto"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalProd;