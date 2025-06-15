import React, { useState, useEffect } from "react";
import './estilosadmin/CrudProd.css';
import { FaTrash, FaEdit } from "react-icons/fa";
import { AiOutlinePlusCircle, AiOutlineArrowLeft } from "react-icons/ai";
import ModalProd from "./ModalProd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CrudProd = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Traer productos del backend
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // Traer categorías del backend
  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  // Editar producto
  const handleEditar = (producto) => {
    setProductoEdit(producto);
    setIsModelOpen(true);
  };

  // Nuevo producto
  const handleNuevo = () => {
    setProductoEdit(null);
    setIsModelOpen(true);
  };

  // Eliminar producto
  const handleEliminar = async (id_producto) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id_producto}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Producto eliminado correctamente");
        fetchProductos(); // refresca la lista
      } else {
        toast.error("Error al eliminar el producto");
      }
    } catch (err) {
      toast.error("Error de red");
    }
  };

  // Cuando se agrega o edita un producto desde el modal
  const handleProductCreated = () => {
    fetchProductos();
  };

  // Determina la clase para el wrapper del botón agregar producto
  const addBtnWrapperClass =
    productos.length === 0
      ? "crudprod-add-btn-wrapper"
      : "crudprod-add-btn-wrapper right";

  return (
    <div className="crudprod-container-father">
      {/* Botón Volver atrás */}
      <button
        onClick={() => navigate(-1)}
        className="cta-button"
      >
        <AiOutlineArrowLeft size={30} className="cta-button-icon" />
        Volver atrás
      </button>

      <div className={addBtnWrapperClass}>
        <button onClick={handleNuevo} className="crudprod-add-btn">
          Agregar Producto
          <AiOutlinePlusCircle size={32} className="crudprod-add-btn-icon" />
        </button>
        <ModalProd
          isOpen={isModelOpen}
          onClose={() => { setIsModelOpen(false); setProductoEdit(null); }}
          onProductCreated={handleProductCreated}
          producto={productoEdit}
          categorias={categorias}
        />
      </div>
      <div className="crudprod-flex-row">
        {loading ? (
          <div className="crudprod-loading">Cargando productos...</div>
        ) : (
          productos.map((producto) => (
            <div
              key={producto.id_producto}
              className="crudprod-card"
            >
              <div className="crudprod-img-wrapper">
                <img
                  src={`http://localhost:3000${producto.imagen_producto}`}
                  alt={producto.nombre_producto}
                  className="crudprod-img"
                />
              </div>
              <div className="crudprod-info">
                <div>
                  <h3 className="crudprod-title">
                    {producto.nombre_producto}
                  </h3>
                  <h4 className="crudprod-category">
                    {producto.nombre_categoria}
                  </h4>
                  <h2 className="crudprod-price">
                    ${producto.precio}
                  </h2>
                  <p className="crudprod-desc">
                    {producto.descripcion}
                  </p>
                  <div className="crudprod-btns">
                    <button
                      className="crudprod-edit-btn"
                      onClick={() => handleEditar(producto)}
                    >
                      Editar <FaEdit />
                    </button>
                    <button
                      className="crudprod-delete-btn"
                      onClick={() => handleEliminar(producto.id_producto)}
                    >
                      Eliminar <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CrudProd;