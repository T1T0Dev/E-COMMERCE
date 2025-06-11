import React, { useEffect, useState } from "react";
import "./estilosadmin/VentasCrud.css";
const VentasCrud = () => {
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [detalleDia, setDetalleDia] = useState([]);
  const [modalFecha, setModalFecha] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/pedidos/ventas-por-dia")
      .then(res => res.json())
      .then(data => setVentasPorDia(data));
  }, []);

  const verDetalle = (fechaCompleta) => {
    // Extrae solo la parte de la fecha (YYYY-MM-DD)
    const fecha = fechaCompleta.split("T")[0];
    fetch(`http://localhost:3000/api/pedidos/ventas-por-dia/${fecha}`)
      .then(res => {
        if (!res.ok) throw new Error("No hay datos para ese día");
        return res.json();
      })
      .then(data => {
        setDetalleDia(data);
        setModalFecha(fecha);
      })
      .catch(() => {
        setDetalleDia([]);
        setModalFecha(fecha);
      });
  };

  const cerrarModal = () => {
    setModalFecha(null);
    setDetalleDia([]);
  };

  return (
    <div className="ventas-crud">
      <h2>Historial de Ventas</h2>
      <table className="ventas-crud-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cantidad de Pedidos</th>
            <th>Total Vendido</th>
            <th>Producto Más Vendido</th>
            <th>Ver Detalle</th>
          </tr>
        </thead>
        <tbody>
          {ventasPorDia.length === 0 ? (
            <tr>
              <td colSpan={5}>No hay ventas registradas.</td>
            </tr>
          ) : (
            ventasPorDia.map((venta, idx) => (
              <tr key={idx}>
                <td>{venta.fecha}</td>
                <td>{venta.cantidad_pedidos}</td>
                <td>${venta.total_vendido}</td>
                <td>{venta.producto_mas_vendido || "-"}</td>
                <td>
                  <button onClick={() => verDetalle(venta.fecha)}>
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal de detalle */}
      {modalFecha && (
        <div className="ventas-crud-modal">
          <div className="ventas-crud-modal-content">
            <h3>Detalle de ventas del {modalFecha}</h3>
            <button onClick={cerrarModal} style={{ float: "right" }}>
              Cerrar
            </button>
            <table className="ventas-crud-detalle-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Talle</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalleDia.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No hay detalles para este día.</td>
                  </tr>
                ) : (
                  detalleDia.map((detalle, idx) => (
                    <tr key={idx}>
                      <td>{detalle.id_pedido}</td>
                      <td>{detalle.cliente_nombre}</td>
                      <td>{detalle.nombre_producto}</td>
                      <td>{detalle.nombre_talle}</td>
                      <td>{detalle.cantidad}</td>
                      <td>${detalle.subtotal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasCrud;
