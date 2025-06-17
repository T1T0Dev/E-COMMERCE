import React, { useState, useEffect } from "react";
import Select from "react-select";
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

  // Opciones para React Select
  const categoriaOptions = categorias.map(cat => ({
    value: String(cat.id_categoria),
    label: cat.nombre_categoria,
  }));

  const [formData, setFormData] = useState({
    nombre_producto: "",
    descripcion: "",
    precio: "",
    id_categoria: "",
  });
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [talles, setTalles] = useState([]);
  const [tallesSeleccionados, setTallesSeleccionados] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3000/api/talles")
        .then((res) => res.json())
        .then((data) => setTalles(data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre_producto: producto.nombre_producto,
        descripcion: producto.descripcion,
        precio: producto.precio,
        id_categoria: producto.id_categoria ? String(producto.id_categoria) : "",
      });
      setImagen(null);

      if (producto.talles && producto.talles.length > 0) {
        const tallesObj = {};
        producto.talles.forEach((t) => {
          tallesObj[t.id_talle] = t.stock;
        });
        setTallesSeleccionados(tallesObj);
      } else {
        setTallesSeleccionados({});
      }
      setPreview(producto.url_imagen || null);
    } else {
      setFormData({
        nombre_producto: "",
        descripcion: "",
        precio: "",
        id_categoria: "",
      });
      setImagen(null);
      setTallesSeleccionados({});
      setPreview(null);
    }
  }, [producto, isOpen]);

  useEffect(() => {
    if (imagen) {
      const url = URL.createObjectURL(imagen);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imagen]);

  const handleTalleChange = (id_talle, checked) => {
    setTallesSeleccionados((prev) => {
      const nuevo = { ...prev };
      if (checked) {
        nuevo[id_talle] = nuevo[id_talle] || 1;
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

  const handleCategoriaChange = (selectedOption) => {
    setFormData({ ...formData, id_categoria: selectedOption ? selectedOption.value : "" });
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

  // Para React Select: encontrar la opción seleccionada
  const selectedCategoria = categoriaOptions.find(
    opt => opt.value === formData.id_categoria
  ) || null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
          <h2 className="modal-title">
            {producto ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}
          </h2>
          <form
            className="modal-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="modal-grid">
              <div className="modal-form-group nombre-prod-group">
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
              <div className="modal-form-group precio-prod-group">
                <label className="modal-label">Precio</label>
                <input
                  className="modal-input no-spin"
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  max="999999"
                  inputMode="decimal"
                  pattern="[0-9]*"
                />
              </div>
              <div className="modal-form-group">
                <label className="modal-label">Categoría</label>
                <Select
                  classNamePrefix="react-select"
                  options={categoriaOptions}
                  value={selectedCategoria}
                  onChange={handleCategoriaChange}
                  placeholder="Seleccionar categoría"
                  isClearable
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      background: "#232323",
                      borderColor: state.isFocused ? "#ededed" : "#353535",
                      color: "#ededed",
                      borderRadius: "12px",
                      minHeight: "48px",
                      boxShadow: state.isFocused ? "0 2px 12px #23232333" : "none",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#ededed",
                    }),
                    menu: (base) => ({
                      ...base,
                      background: "#232323",
                      color: "#ededed",
                      borderRadius: "12px",
                      marginTop: 2,
                    }),
                    option: (base, state) => ({
                      ...base,
                      background: state.isSelected
                        ? "#353535"
                        : state.isFocused
                        ? "#2a2a2a"
                        : "#232323",
                      color: "#ededed",
                      cursor: "pointer",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#bdbdbd",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: "#ededed",
                    }),
                    indicatorSeparator: (base) => ({
                      ...base,
                      background: "#353535",
                    }),
                  }}
                />
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
              {preview && (
                <div className="modal-img-preview">
                  <img src={preview} alt="Previsualización" />
                </div>
              )}
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