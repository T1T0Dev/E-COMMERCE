import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalConfirmacion from "../components/ModalConfirmacion";
import AdminNavbar from "../components/AdminNavbar";
import AdminHomeButton from "../components/AdminHomeButton";
import {formatPrice} from "../utils/formatPrice"; 
import axios from "axios";
import "./styles/CarritosAdmin.css";

const CarritosAdmin = () => {
  const [carritos, setCarritos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [carritoDetalle, setCarritoDetalle] = useState(null);
  const [modalConfirm, setModalConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/carrito/fusion")
      .then((res) => setCarritos(res.data))
      .catch(() => toast.error("Error al cargar carritos"));
  }, []);

  const carritosFiltrados = carritos.filter(
    (c) =>
      (filtroEstado ? c.estado === filtroEstado : true) &&
      (busquedaCliente
        ? (c.cliente || "")
            .toLowerCase()
            .includes(busquedaCliente.toLowerCase()) ||
          (c.cliente_nombre || "")
            .toLowerCase()
            .includes(busquedaCliente.toLowerCase())
        : true)
  );

  const handleCambiarEstado = async (id_carrito) => {
    try {
      await axios.put(
        `http://localhost:3000/api/carrito/${id_carrito}/estado`,
        { estado: "entregado" }
      );
      toast.success("Estado actualizado a entregado");
      setCarritos((carritos) =>
        carritos.map((c) =>
          c.id_carrito === id_carrito ? { ...c, estado: "entregado" } : c
        )
      );
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  // Usar modal de confirmación para eliminar
  const handleEliminar = (id_carrito) => {
  const carrito = carritos.find((c) => c.id_carrito === id_carrito);
  if (carrito && (carrito.estado === "pagado" || carrito.estado === "entregado")) {
    toast.info("No puedes eliminar un carrito que ya fue Entregado / Pagado");
    return;
  }
  setModalConfirm({ open: true, id: id_carrito });
};

  const confirmarEliminar = async () => {
    const id_carrito = modalConfirm.id;
    setModalConfirm({ open: false, id: null });
    try {
      await axios.delete(`http://localhost:3000/api/carrito/${id_carrito}`);
      toast.success("Carrito eliminado");
      setCarritos((carritos) =>
        carritos.filter((c) => c.id_carrito !== id_carrito)
      );
    } catch {
      toast.error("Error al eliminar carrito");
    }
  };

  const handleVerDetalle = (id_carrito) => {
    const carrito = carritos.find((c) => c.id_carrito === id_carrito);
    setCarritoDetalle(carrito);
  };

  const handleContactarCliente = (telefono) => {
    if (!telefono) return;
    const tel = telefono.replace(/\D/g, "");
    window.open(`https://wa.me/54${tel}`, "_blank");
  };

  const handleMarcarPagado = async (id_carrito) => {
    try {
      await axios.put(
        `http://localhost:3000/api/carrito/${id_carrito}/estado`,
        { estado: "pagado" }
      );
      toast.success("Estado actualizado a pagado");
      setCarritos((carritos) =>
        carritos.map((c) =>
          c.id_carrito === id_carrito ? { ...c, estado: "pagado" } : c
        )
      );
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  return (
    <div className="carritos-admin-bg">
      <div className="carritos-admin-back-btn-wrapper">
        <AdminNavbar />
        <AdminHomeButton />
      </div>
      <div className="carritos-admin-content">
        <ModalConfirmacion
          isOpen={modalConfirm.open}
          onClose={() => setModalConfirm({ open: false, id: null })}
          onConfirm={confirmarEliminar}
          mensaje="¿Estás seguro de eliminar este carrito? Esta acción no se puede deshacer."
          titulo="Eliminar carrito"
          textoConfirmar="Sí, eliminar"
          textoCancelar="Cancelar"
        />
        <div className="carritos-admin-header">
          <h2 className="carritos-admin-title">Gestión de Carritos</h2>
        </div>
        <div className="carritos-admin-filtros">
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            className="carritos-admin-buscador"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="carritos-admin-select"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="pagado">Pagado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        {/* Tabla para desktop */}
        <div className="carritos-admin-table-wrapper">
          <table className="carritos-admin-table">
            <thead>
              <tr>
                <th title="Identificador del carrito">#</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th title="Fecha de creación">Creado</th>
                <th title="Número de pedido asociado">N° Pedido</th>
                <th title="Dirección de envío o punto de retiro">
                  Envío / Retiro
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carritosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="carritos-admin-td-vacio">
                    No hay carritos para mostrar.
                  </td>
                </tr>
              ) : (
                carritosFiltrados.map((c) => (
                  <tr key={c.id_carrito} className="carritos-admin-row">
                    <td>{c.id_carrito}</td>
                    <td>
                      <b>{c.cliente || c.cliente_nombre || "-"}</b>
                      <br />
                      <span style={{ color: "#aaa", fontSize: "0.95em" }}>
                        {c.telefono ? `📱 ${c.telefono}` : ""}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`carritos-admin-estado carritos-admin-estado-${c.estado}`}
                        title={
                          c.estado.charAt(0).toUpperCase() + c.estado.slice(1)
                        }
                      >
                        {c.estado === "entregado"
                          ? " Entregado"
                          : c.estado === "pagado"
                          ? " Pagado"
                          : c.estado === "activo"
                          ? " Activo"
                          : " Cancelado"}
                      </span>
                    </td>
                    <td>
                      {c.fecha_creacion
                        ? c.fecha_creacion.slice(0, 16).replace("T", " ")
                        : "-"}
                    </td>
                    <td>{c.id_pedido || "-"}</td>
                    <td>
                      {c.requiere_envio
                        ? c.direccion_envio || "Usar dirección registrada"
                        : "Punto de Encuentro"}
                    </td>
                    <td>
                      <div className="carritos-admin-actions">
                        <button
                          className="carritos-admin-btn-detalle"
                          title="Ver detalle"
                          onClick={() => handleVerDetalle(c.id_carrito)}
                        >
                          👁️
                        </button>
                        <button
                          className="carritos-admin-btn-contactar"
                          title="Contactar cliente"
                          onClick={() => handleContactarCliente(c.telefono)}
                          disabled={!c.telefono}
                        >
                          📞
                        </button>
                        <button
                          className="carritos-admin-btn-pagado"
                          title="Marcar como pagado"
                          onClick={() => handleMarcarPagado(c.id_carrito)}
                          disabled={c.estado === "pagado"}
                        >
                          💲
                        </button>
                        <button
                          className="carritos-admin-btn-estado"
                          title="Marcar como entregado"
                          onClick={() => handleCambiarEstado(c.id_carrito)}
                          disabled={c.estado !== "pagado"}
                        >
                          ✅
                        </button>
                        <button
                          className="carritos-admin-btn-eliminar"
                          title="Eliminar carrito"
                          onClick={() => handleEliminar(c.id_carrito)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Cards para mobile */}
        <div className="carritos-admin-cards-mobile">
          {carritosFiltrados.length === 0 ? (
            <div className="carritos-admin-card-vacio">
              No hay carritos para mostrar.
            </div>
          ) : (
            carritosFiltrados.map((c) => (
              <div className="carritos-admin-card" key={c.id_carrito}>
                <div className="carritos-admin-card-row">
                  <span className="carritos-admin-card-label">#</span>
                  <span>{c.id_carrito}</span>
                </div>
                <div className="carritos-admin-card-row">
                  <span className="carritos-admin-card-label">Cliente</span>
                  <span>
                    <b>{c.cliente || c.cliente_nombre || "-"}</b>
                    <br />
                    <span style={{ color: "#aaa", fontSize: "0.95em" }}>
                      {c.telefono ? `📱 ${c.telefono}` : ""}
                    </span>
                  </span>
                </div>
                <div className="carritos-admin-card-row">
                  <span className="carritos-admin-card-label">Estado</span>
                  <span
                    className={`carritos-admin-estado carritos-admin-estado-${c.estado}`}
                  >
                    {c.estado === "entregado"
                      ? " Entregado"
                      : c.estado === "pagado"
                      ? " Pagado"
                      : c.estado === "activo"
                      ? " Activo"
                      : " Cancelado"}
                  </span>
                </div>
                <div className="carritos-admin-card-row">
                  <span className="carritos-admin-card-label">Creado</span>
                  <span>
                    {c.fecha_creacion
                      ? c.fecha_creacion.slice(0, 16).replace("T", " ")
                      : "-"}
                  </span>
                </div>
                <div className="carritos-admin-card-row">
                  <span className="carritos-admin-card-label">N° Pedido</span>
                  <span>{c.id_pedido || "-"}</span>
                </div>
                <div className="carritos-admin-card-row">
                  <span className="carritos-admin-card-label">Envío / Retiro</span>
                  <span>
                    {c.requiere_envio
                      ? c.direccion_envio || "Usar dirección registrada"
                      : "Punto de Encuentro"}
                  </span>
                </div>
                <div className="carritos-admin-card-actions">
                  <button
                    className="carritos-admin-btn-detalle"
                    title="Ver detalle"
                    onClick={() => handleVerDetalle(c.id_carrito)}
                  >
                    👁️
                  </button>
                  <button
                    className="carritos-admin-btn-contactar"
                    title="Contactar cliente"
                    onClick={() => handleContactarCliente(c.telefono)}
                    disabled={!c.telefono}
                  >
                    📞
                  </button>
                  <button
                    className="carritos-admin-btn-pagado"
                    title="Marcar como pagado"
                    onClick={() => handleMarcarPagado(c.id_carrito)}
                    disabled={c.estado === "pagado"}
                  >
                    💲
                  </button>
                  <button
                    className="carritos-admin-btn-estado"
                    title="Marcar como entregado"
                    onClick={() => handleCambiarEstado(c.id_carrito)}
                    disabled={c.estado !== "pagado"}
                  >
                    ✅
                  </button>
                  <button
                    className="carritos-admin-btn-eliminar"
                    title="Eliminar carrito"
                    onClick={() => handleEliminar(c.id_carrito)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {carritoDetalle && (
          <div className="carritos-admin-detalle-modal">
            <div>
              <h3 className="carritos-admin-detalle-title">
                Carrito #{carritoDetalle.id_carrito}
              </h3>
              <p className="carritos-admin-detalle-cliente">
                Cliente:{" "}
                <b>{carritoDetalle.cliente || carritoDetalle.cliente_nombre}</b>
              </p>
              <p style={{ marginBottom: 18, color: "#888" }}>
                Estado: <b>{carritoDetalle.estado}</b> | Fecha:{" "}
                {carritoDetalle.fecha_creacion}
              </p>
              <table className="carritos-admin-detalle-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Imagen</th>
                    <th>Talle</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {carritoDetalle.productos &&
                  carritoDetalle.productos.length > 0 ? (
                    carritoDetalle.productos.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.nombre_producto}</td>
                        <td>
                          {item.imagen_producto ? (
                            <img
                              src={
                                item.imagen_producto.startsWith("http")
                                  ? item.imagen_producto
                                  : `http://localhost:3000${item.imagen_producto}`
                              }
                              alt={item.nombre_producto}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 8,
                                boxShadow: "0 2px 8px #0001",
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{item.nombre_talle}</td>
                        <td>{item.cantidad}</td>
                        <td>${formatPrice(item.subtotal ?? 0)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No hay detalles para este carrito.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <h4 className="carritos-admin-detalle-total">
                Total:{" "}
                {carritoDetalle.total_venta != null
                  ? `$${formatPrice(carritoDetalle.total_venta)}`
                  : `$${formatPrice(
                      (carritoDetalle.productos || []).reduce(
                        (acc, p) => acc + (p.subtotal || 0),
                        0
                      )
                    )}`}
              </h4>
              <button
                onClick={() => setCarritoDetalle(null)}
                className="carritos-admin-btn-cerrar"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritosAdmin;