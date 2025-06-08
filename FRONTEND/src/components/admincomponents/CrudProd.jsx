import React, { useState, useEffect } from "react";
import './estilosadmin/CrudProd.css';
import { FaTrash, FaEdit } from "react-icons/fa";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ModalProd from "./ModalProd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

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
    // Quita el toast de aquí para evitar duplicados
    // toast.success("Producto agregado correctamente");
  };

  return (
    <div className="crudprod-container-father">
      {/* Botón Volver atrás */}
      <button
        onClick={() => navigate(-1)}
        className="cta-button"
      >
        <AiOutlineArrowLeft size={30} className="drop-shadow" />
        Volver atrás
      </button>

      <div className="crudprod-add-btn-wrapper flex justify-center mb-6">
        <button onClick={handleNuevo} className="crudprod-add-btn bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
          Agregar Producto 
          <AiOutlinePlusCircle size={45}/>
        </button>
        <ModalProd
          isOpen={isModelOpen}
          onClose={() => { setIsModelOpen(false); setProductoEdit(null); }}
          onProductCreated={handleProductCreated}
          producto={productoEdit}
          categorias={categorias}
        />
      </div>
      <div className="crudprod-flex-row flex flex-row flex-wrap gap-[20px] justify-center">
        {loading ? (
          <div>Cargando productos...</div>
        ) : (
          productos.map((producto) => (
            <div
              key={producto.id_producto}
              className="crudprod-card bg-white rounded-xl shadow-md flex flex-col overflow-hidden h-[480px] mx-auto"
            >
              <div className="crudprod-img-wrapper w-full h-64 overflow-hidden flex items-center justify-center">
                <img
                  src={`http://localhost:3000${producto.imagen_producto}`}
                  alt={producto.nombre_producto}
                  className="crudprod-img w-full h-64 object-cover"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "16rem",
                    minHeight: "16rem",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="crudprod-info p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="crudprod-title text-lg font-semibold">
                    {producto.nombre_producto}
                  </h3>
                  <h4 className="crudprod-category text-sm font-medium text-blue-600 mt-1">
                    {producto.nombre_categoria}
                  </h4>
                  <h2 className="crudprod-price text-xl font-bold text-gray-800 mt-2">
                    ${producto.precio}
                  </h2>
                  <p className="crudprod-desc text-gray-500 text-sm mt-1">
                    {producto.descripcion}
                  </p>
                  <div className="crudprod-btns flex gap-2 mt-2">
                    <button
                      className="crudprod-edit-btn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                      onClick={() => handleEditar(producto)}
                    >
                      Editar <br />
                      <FaEdit />
                    </button>
                    <button
                      className="crudprod-delete-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => handleEliminar(producto.id_producto)}
                    >
                      Eliminar <br />
                      <FaTrash />
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