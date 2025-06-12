import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./estilosadmin/CarritosAdmin.css";

const CarritosAdmin = () => {
  const [carritos, setCarritos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [carritoDetalle, setCarritoDetalle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/carrito/fusion")
      .then((res) => res.json())
      .then((data) => setCarritos(data));
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
    const res = await fetch(
      `http://localhost:3000/api/carrito/${id_carrito}/estado`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "entregado" }),
      }
    );
    if (res.ok) {
      toast.success("Estado actualizado a entregado");
      setCarritos((carritos) =>
        carritos.map((c) =>
          c.id_carrito === id_carrito ? { ...c, estado: "entregado" } : c
        )
      );
    } else {
      toast.error("Error al cambiar estado");
    }
  };

  const handleEliminar = async (id_carrito) => {
    if (!window.confirm("¿Eliminar este carrito?")) return;
    const res = await fetch(`http://localhost:3000/api/carrito/${id_carrito}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Carrito eliminado");
      setCarritos((carritos) =>
        carritos.filter((c) => c.id_carrito !== id_carrito)
      );
    } else {
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
    const res = await fetch(
      `http://localhost:3000/api/carrito/${id_carrito}/estado`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "pagado" }),
      }
    );
    if (res.ok) {
      toast.success("Estado actualizado a pagado");
      setCarritos((carritos) =>
        carritos.map((c) =>
          c.id_carrito === id_carrito ? { ...c, estado: "pagado" } : c
        )
      );
    } else {
      toast.error("Error al cambiar estado");
    }
  };

  return (
    <div className="carritos-admin-bg">
      <div className="carritos-admin-back-btn-wrapper">
        <button onClick={() => navigate(-1)} className="cta-button">
          <AiOutlineArrowLeft size={30} className="drop-shadow" />
          Volver atrás
        </button>
      </div>
      <div className="carritos-admin-container">
        <ToastContainer />
        <h2 className="carritos-admin-title">Gestión de Carritos</h2>
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
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="entregado">Entregado</option>
          </select>
        </div>
        <div className="carritos-admin-table-wrapper">
          <table className="carritos-admin-table">
            <thead>
              <tr>
                <th className="carritos-admin-th">ID</th>
                <th className="carritos-admin-th">Cliente</th>
                <th className="carritos-admin-th">Estado</th>
                <th className="carritos-admin-th">Fecha</th>
                <th className="carritos-admin-th">Pedido</th>
                <th className="carritos-admin-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carritosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#888", padding: "2rem" }}>
                    No hay carritos para mostrar.
                  </td>
                </tr>
              ) : (
                carritosFiltrados.map((c) => (
                  <tr key={c.id_carrito} className="carritos-admin-row">
                    <td className="carritos-admin-td">{c.id_carrito}</td>
                    <td className="carritos-admin-td">
                      {c.cliente || c.cliente_nombre || "-"}
                    </td>
                    <td className="carritos-admin-td">{c.estado}</td>
                    <td className="carritos-admin-td">
                      {c.fecha_creacion
                        ? c.fecha_creacion.slice(0, 16).replace("T", " ")
                        : "-"}
                    </td>
                    <td className="carritos-admin-td">{c.id_pedido || "-"}</td>
                    <td className="carritos-admin-td">
                      <div className="carritos-admin-actions">
                        <button
                          className="carritos-admin-btn-detalle"
                          onClick={() => handleVerDetalle(c.id_carrito)}
                        >
                          Ver Detalle
                        </button>
                        <button
                          className="carritos-admin-btn-contactar"
                          onClick={() => handleContactarCliente(c.telefono)}
                          disabled={!c.telefono}
                        >
                          Contactar Cliente
                        </button>
                        <button
                          className="carritos-admin-btn-pagado"
                          onClick={() => handleMarcarPagado(c.id_carrito)}
                          disabled={c.estado === "pagado"}
                        >
                          Marcar Pagado
                        </button>
                        <button
                          className="carritos-admin-btn-estado"
                          onClick={() => handleCambiarEstado(c.id_carrito)}
                          disabled={c.estado !== "pagado"}
                        >
                          Marcar como Entregado
                        </button>
                        <button
                          className="carritos-admin-btn-eliminar"
                          onClick={() => handleEliminar(c.id_carrito)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {carritoDetalle && (
          <div className="carritos-admin-detalle-modal">
            <div>
              <h3 className="carritos-admin-detalle-title">
                Carrito #{carritoDetalle.id_carrito}
              </h3>
              <p className="carritos-admin-detalle-cliente">
                Cliente: <b>{carritoDetalle.cliente || carritoDetalle.cliente_nombre}</b>
              </p>
              <p style={{ marginBottom: 18, color: "#888" }}>
                Estado: <b>{carritoDetalle.estado}</b> | Fecha: {carritoDetalle.fecha_creacion}
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
                  {carritoDetalle.productos && carritoDetalle.productos.length > 0 ? (
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
                        <td>${item.subtotal ?? 0}</td>
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
                  ? `$${carritoDetalle.total_venta}`
                  : `$${(carritoDetalle.productos || []).reduce(
                      (acc, p) => acc + (p.subtotal || 0),
                      0
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