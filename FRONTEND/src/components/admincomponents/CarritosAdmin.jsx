import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import './estilosadmin/CarritosAdmin.css'; // Asegúrate de crear este archivo CSS
const CarritosAdmin = () => {
    const [carritos, setCarritos] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("");
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [carritoDetalle, setCarritoDetalle] = useState(null);

    // Traer carritos
    useEffect(() => {
        fetch("http://localhost:3000/api/carrito")
            .then(res => res.json())
            .then(data => setCarritos(data));
    }, []);

    // Filtrar carritos
    const carritosFiltrados = carritos.filter(c =>
        (filtroEstado ? c.estado === filtroEstado : true) &&
        (busquedaCliente ? c.cliente_nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) : true)
    );

    // Cambiar estado
    const handleCambiarEstado = async (id_carrito, nuevoEstado) => {
        const res = await fetch(`http://localhost:3000/api/carrito/${id_carrito}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: nuevoEstado }),
        });
        if (res.ok) {
            toast.success("Estado actualizado");
            // Actualiza la lista
            setCarritos(carritos =>
                carritos.map(c =>
                    c.id_carrito === id_carrito ? { ...c, estado: nuevoEstado } : c
                )
            );
        } else {
            toast.error("Error al cambiar estado");
        }
    };

    // Eliminar carrito
    const handleEliminar = async (id_carrito) => {
        if (!window.confirm("¿Eliminar este carrito?")) return;
        const res = await fetch(`http://localhost:3000/api/carrito/${id_carrito}`, {
            method: "DELETE",
        });
        if (res.ok) {
            toast.success("Carrito eliminado");
            setCarritos(carritos => carritos.filter(c => c.id_carrito !== id_carrito));
        } else {
            toast.error("Error al eliminar carrito");
        }
    };

    // Ver detalle
    const handleVerDetalle = async (id_carrito) => {
        const res = await fetch(`http://localhost:3000/api/carrito/${id_carrito}`);
        const data = await res.json();
        setCarritoDetalle(data);
    };

    return (
        <div className="carritos-admin-container">
            <ToastContainer />
            <h2 className="carritos-admin-title">Carritos</h2>
            <div className="carritos-admin-filtros">
                <label className="carritos-admin-label">Estado:</label>
                <select
                    className="carritos-admin-select"
                    value={filtroEstado}
                    onChange={e => setFiltroEstado(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="enviado">Enviado</option>
                </select>
                <input
                    className="carritos-admin-busqueda"
                    placeholder="Buscar cliente"
                    value={busquedaCliente}
                    onChange={e => setBusquedaCliente(e.target.value)}
                />
            </div>
            <table className="carritos-admin-table">
                <thead>
                    <tr>
                        <th className="carritos-admin-th">ID</th>
                        <th className="carritos-admin-th">Cliente</th>
                        <th className="carritos-admin-th">Estado</th>
                        <th className="carritos-admin-th">Fecha</th>
                        <th className="carritos-admin-th">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {carritosFiltrados.map(c => (
                        <tr key={c.id_carrito} className="carritos-admin-row">
                            <td className="carritos-admin-td">{c.id_carrito}</td>
                            <td className="carritos-admin-td">{c.cliente_nombre}</td>
                            <td className="carritos-admin-td">{c.estado}</td>
                            <td className="carritos-admin-td">{c.fecha_creacion}</td>
                            <td className="carritos-admin-td">
                                <button
                                    className="carritos-admin-btn-detalle"
                                    onClick={() => handleVerDetalle(c.id_carrito)}
                                >
                                    Ver Detalle
                                </button>
                                <button
                                    className="carritos-admin-btn-estado"
                                    onClick={() => handleCambiarEstado(c.id_carrito, c.estado === "activo" ? "enviado" : "activo")}
                                >
                                    Cambiar Estado
                                </button>
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal o sección de detalle */}
            {carritoDetalle && (
  <div className="carritos-admin-detalle-modal">
    <div>
      <h3 className="carritos-admin-detalle-title">
        Carrito #{carritoDetalle.id_carrito}
      </h3>
      <p className="carritos-admin-detalle-cliente">
        Cliente: <b>{carritoDetalle.cliente_nombre}</b>
      </p>
      <p style={{marginBottom: 18, color: "#4a4e69"}}>
        Estado: <b>{carritoDetalle.estado}</b> | Fecha: {carritoDetalle.fecha_creacion}
      </p>
      <table className="carritos-admin-detalle-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Imagen</th>
            <th>Talle</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {carritoDetalle.detalle && carritoDetalle.detalle.length > 0 ? (
            carritoDetalle.detalle.map(item => (
              <tr key={item.id_carrito_detalle}>
                <td>{item.nombre_producto}</td>
                <td>
                  <img
                    src={`http://localhost:3000${item.imagen_producto}`}
                    alt={item.nombre_producto}
                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px #0001" }}
                  />
                </td>
                <td>{item.nombre_talle}</td>
                <td>{item.cantidad}</td>
                <td>${Number(item.precio_unitario).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>${Number(item.subtotal).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No hay detalles para este carrito.</td>
            </tr>
          )}
        </tbody>
      </table>
      <h4 className="carritos-admin-detalle-total">
        Total: ${Number(carritoDetalle.total).toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
      </h4>
      <button
        className="carritos-admin-detalle-cerrar"
        onClick={() => setCarritoDetalle(null)}
      >
        Cerrar
      </button>
    </div>
  </div>
)}
        </div>
    );
};

export default CarritosAdmin;