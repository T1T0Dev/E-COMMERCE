import React, { useState, useEffect } from "react";
import "./styles/CrudProd.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ModalProd from "../components/ModalProd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModalConfirmacion from "../components/ModalConfirmacion";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import AdminHomeButton from "../components/AdminHomeButton";
import { formatPrice } from "../utils/formatPrice";

const CrudProd = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalConfirm, setModalConfirm] = useState({
    open: false,
    id: null,
    nombre: "",
    tipo: null, // "baja" o "fisico"
  });
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const navigate = useNavigate();

  // Traer productos del backend según el switch
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const activo = mostrarInactivos ? 0 : 1;
      const res = await axios.get(
        `http://localhost:3000/api/productos?activo=${activo}`
      );
      setProductos(res.data);
    } catch (err) {
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // Traer categorías del backend
  const fetchCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/categorias");
      setCategorias(res.data);
    } catch (err) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    // eslint-disable-next-line
  }, [mostrarInactivos]);

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

  // Abrir modal de confirmación para baja lógica
  const handleEliminar = (id_producto, nombre_producto) => {
    setModalConfirm({
      open: true,
      id: id_producto,
      nombre: nombre_producto,
      tipo: "baja",
    });
  };

  // Abrir modal de confirmación para borrado físico
  const handleEliminarFisico = (id_producto, nombre_producto) => {
    setModalConfirm({
      open: true,
      id: id_producto,
      nombre: nombre_producto,
      tipo: "fisico",
    });
  };

  // Confirmar acción (baja lógica o borrado físico)
  const confirmarEliminar = async () => {
    const { id, tipo } = modalConfirm;
    try {
      if (tipo === "fisico") {
        await axios.delete(`http://localhost:3000/api/productos/fisico/${id}`);
        toast.success("Producto eliminado definitivamente");
      } else {
        await axios.put(`http://localhost:3000/api/productos/baja/${id}`);
        toast.success("Producto dado de baja correctamente");
      }
      fetchProductos();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Error al eliminar el producto"
      );
    } finally {
      setModalConfirm({ open: false, id: null, nombre: "", tipo: null });
    }
  };

  // Cuando se agrega o edita un producto desde el modal
  const handleProductCreated = (mensaje) => {
    fetchProductos();
    if (mensaje) toast.success(mensaje);
  };

  const addBtnWrapperClass =
    productos.length === 0
      ? "crudprod-add-btn-wrapper"
      : "crudprod-add-btn-wrapper right";

  return (
    <div className="crudprod-container-father">
      <AdminNavbar />
      <AdminHomeButton />
      {/* Switch para mostrar activos/inactivos */}
      <div className="crudprod-switch-wrapper">
        <span
          className={!mostrarInactivos ? "switch-label active" : "switch-label"}
        >
          ACTIVOS
        </span>
        <label className="switch-toggle">
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={() => setMostrarInactivos((v) => !v)}
          />
          <span className="slider"></span>
        </label>
        <span
          className={mostrarInactivos ? "switch-label active" : "switch-label"}
        >
          INACTIVOS
        </span>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={modalConfirm.open}
        onClose={() =>
          setModalConfirm({ open: false, id: null, nombre: "", tipo: null })
        }
        onConfirm={confirmarEliminar}
        mensaje={
          modalConfirm.tipo === "fisico"
            ? `¿Seguro que deseas eliminar definitivamente "${modalConfirm.nombre}"? Esta acción es irreversible.`
            : `¿Estás seguro que deseas dar de baja "${modalConfirm.nombre}"?`
        }
        titulo={
          modalConfirm.tipo === "fisico"
            ? "Eliminar producto"
            : "Dar de baja producto"
        }
        textoConfirmar={
          modalConfirm.tipo === "fisico"
            ? "Sí, eliminar"
            : "Sí, dar de baja"
        }
        textoCancelar="Cancelar"
      />

      <div className={addBtnWrapperClass}>
        <button onClick={handleNuevo} className="crudprod-add-btn">
          Agregar Producto
          <AiOutlinePlusCircle size={32} className="crudprod-add-btn-icon" />
        </button>
        <ModalProd
          isOpen={isModelOpen}
          onClose={() => {
            setIsModelOpen(false);
            setProductoEdit(null);
          }}
          onProductCreated={handleProductCreated}
          producto={productoEdit}
          categorias={categorias}
        />
      </div>
      <div className="crudprod-flex-row">
        {loading ? (
          <div className="crudprod-loading">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div className="crudprod-loading">
            {mostrarInactivos
              ? "No hay productos inactivos."
              : "No hay productos activos."}
          </div>
        ) : (
          productos.map((producto) => (
            <div key={producto.id_producto} className="crudprod-card">
              <div className="crudprod-img-wrapper">
                <img
                  src={`http://localhost:3000${producto.imagen_producto}`}
                  alt={producto.nombre_producto}
                  className="crudprod-img"
                />
              </div>
              <div className="crudprod-info">
                <div>
                  <h3 className="crudprod-title">{producto.nombre_producto}</h3>
                  <h2 className="crudprod-price">
                    ${formatPrice(producto.precio)}
                  </h2>
                  <p className="crudprod-desc">{producto.descripcion}</p>
                  <div className="crudprod-btns">
                    <button
                      className="crudprod-edit-btn"
                      onClick={() => handleEditar(producto)}
                      disabled={producto.activo === 0}
                    >
                      Editar <FaEdit />
                    </button>
                    {!mostrarInactivos ? (
                      <>
                        <button
                          className="crudprod-delete-btn"
                          onClick={() =>
                            handleEliminar(
                              producto.id_producto,
                              producto.nombre_producto
                            )
                          }
                        >
                          Dar de baja <FaTrash />
                        </button>
                        <button
                          className="crudprod-delete-physic-btn"
                          title="Eliminar producto definitivamente"
                          onClick={() =>
                            handleEliminarFisico(
                              producto.id_producto,
                              producto.nombre_producto
                            )
                          }
                        >
                          Eliminar <FaTrash />
                        </button>
                      </>
                    ) : (
                      <button
                        className="crudprod-activar-btn"
                        onClick={async () => {
                          if (
                            !producto.id_categoria ||
                            !producto.nombre_categoria
                          ) {
                            toast.error(
                              "No puedes dar de alta este producto porque no tiene categoría asignada. Edita el producto y selecciona una categoría."
                            );
                            return;
                          }
                          try {
                            await axios.put(
                              `http://localhost:3000/api/productos/activar/${producto.id_producto}`
                            );
                            toast.success("Producto dado de alta correctamente");
                            fetchProductos();
                          } catch (err) {
                            toast.error("Error al dar de alta el producto");
                          }
                        }}
                      >
                        Dar de alta <FaEdit />
                      </button>
                    )}
                  </div>
                  {producto.activo === 0 && (
                    <div className="crudprod-inactivo-label">
                      Producto inactivo
                    </div>
                  )}
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