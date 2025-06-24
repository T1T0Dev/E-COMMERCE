import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/VentasCrud.css";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminHomeButton from "../components/AdminHomeButton";
import { formatPrice } from "../utils/formatPrice";

const VentasCrud = () => {
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [detalleDia, setDetalleDia] = useState([]);
  const [modalFecha, setModalFecha] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/pedidos/ventas-por-dia")
      .then((res) => setVentasPorDia(res.data));
  }, []);

  const verDetalle = (fecha) => {
    const fechaCorta = fecha.slice(0, 10);
    axios
      .get(`http://localhost:3000/api/pedidos/ventas-por-dia/${fechaCorta}`)
      .then((res) => {
        setDetalleDia(res.data);
        setModalFecha(fechaCorta);
      })
      .catch(() => {
        setDetalleDia([]);
        setModalFecha(fechaCorta);
      });
  };

  const cerrarModal = () => {
    setModalFecha(null);
    setDetalleDia([]);
  };

  function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    const d = new Date(fechaISO);
    const dia = d.getDate().toString().padStart(2, "0");
    const mes = (d.getMonth() + 1).toString().padStart(2, "0");
    const anio = d.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  return (
    <div className="ventas-crud-bg">
      <AdminNavbar />
      <div className="ventascrud-back-btn-wrapper">
        <AdminHomeButton />
      </div>
      <div className="ventas-crud-content">
        <h2>Historial de Ventas</h2>
        {/* Tabla resumen diario */}
        <table className="ventas-crud-table">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>TOTAL VENDIDO</th>
              <th>CANTIDAD PEDIDOS</th>
              <th>PRODUCTO MÁS VENDIDO</th>
              <th>VER DETALLE</th>
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
                  <td>{formatearFecha(venta.fecha)}</td>
                  <td>${formatPrice(venta.total_vendido)}</td>
                  <td>{venta.cantidad_pedidos}</td>
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
              <h3>Detalle de ventas del {formatearFecha(modalFecha)}</h3>
              <button onClick={cerrarModal} style={{ float: "right" }}>
                Cerrar
              </button>
              <table className="ventas-crud-detalle-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Talle</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleDia.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No hay detalles para este día.</td>
                    </tr>
                  ) : (
                    detalleDia.map((detalle, idx) => (
                      <tr key={idx}>
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
    </div>
  );
};

export default VentasCrud;
