import React, { useEffect, useState } from "react";
import axios from "axios";
import "./estilosadmin/PedidosCrud.css";
import { toast } from "react-toastify";

const estados = [
  { label: "Pendientes", value: "pendiente" },
  { label: "Confirmados", value: "confirmado" },
  { label: "Entregados", value: "entregado" },
  { label: "Cancelados", value: "cancelado" },
];

const PedidosCrud = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("pendiente");

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const res = await axios.get("http://localhost:3000/api/pedidos/join");
    setPedidos(res.data);
  };

  const cambiarEstado = async (
    id_pedido,
    nuevoEstado,
    id_carrito,
    id_cliente
  ) => {
    try {
      await axios.put(`http://localhost:3000/api/pedidos/${id_pedido}/estado`, {
        estado: nuevoEstado,
      });
      if (id_carrito) {
        await axios.put(
          `http://localhost:3000/api/carritos/${id_carrito}/estado`,
          {
            estado: "enviado",
          }
        );
      }
      if (nuevoEstado === "confirmado") {
        toast.success(
          `¡Pedido confirmado! Se notificó al cliente (ID: ${id_cliente}): Gracias por comprar en Drekkz.`
        );
      }
      if (nuevoEstado === "cancelado") {
        toast.info("Pedido cancelado.");
      }
      fetchPedidos();
    } catch (error) {
      toast.error("Error al actualizar el estado del pedido.");
    }
  };

  // Filtrar pedidos por estado seleccionado
  const pedidosFiltrados = pedidos.filter(
    (pedido) => pedido.estado === filtroEstado
  );

  return (
    <div className="pedidos-crud-container">
      <h2>Gestión de Pedidos</h2>
      <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        {estados.map((e) => (
          <button
            key={e.value}
            onClick={() => setFiltroEstado(e.value)}
            className={`filtro-btn${filtroEstado === e.value ? " activo" : ""}`}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: filtroEstado === e.value ? "#232526" : "#e5e7eb",
              color: filtroEstado === e.value ? "#fff" : "#232526",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.18s",
            }}
          >
            {e.label}
          </button>
        ))}
      </div>
      <table className="pedidos-table">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                No hay pedidos {filtroEstado}.
              </td>
            </tr>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td>{pedido.id_pedido}</td>
                <td>
                  {pedido.nombre_cliente} {pedido.apellido_cliente}
                </td>
                <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                <td>{pedido.estado}</td>
                <td>
                  {pedido.detalles.map((detalle) => (
                    <div key={detalle.id_detalle}>
                      {detalle.nombre_producto} ({detalle.nombre_talle}) x
                      {detalle.cantidad}
                    </div>
                  ))}
                </td>
                <td>
                  ${pedido.detalles.reduce((acc, d) => acc + d.subtotal, 0)}
                </td>
                <td>
                  {pedido.estado === "pendiente" && (
                    <>
                      <button
                        onClick={() =>
                          cambiarEstado(
                            pedido.id_pedido,
                            "confirmado",
                            pedido.id_carrito,
                            pedido.id_cliente
                          )
                        }
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() =>
                          cambiarEstado(
                            pedido.id_pedido,
                            "cancelado",
                            pedido.id_carrito,
                            pedido.id_cliente
                          )
                        }
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {pedido.estado === "confirmado" && (
                    <>
                      <button
                        onClick={() =>
                          cambiarEstado(
                            pedido.id_pedido,
                            "entregado",
                            pedido.id_carrito,
                            pedido.id_cliente
                          )
                        }
                      >
                        Marcar como entregado
                      </button>
                      <button
                        onClick={() =>
                          cambiarEstado(
                            pedido.id_pedido,
                            "cancelado",
                            pedido.id_carrito,
                            pedido.id_cliente
                          )
                        }
                        style={{ background: "#b91c1c", marginLeft: 8 }}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {pedido.estado === "confirmado" && (
                    <button
                      onClick={() =>
                        cambiarEstado(
                          pedido.id_pedido,
                          "entregado",
                          pedido.id_carrito,
                          pedido.id_cliente
                        )
                      }
                    >
                      Marcar como entregado
                    </button>
                  )}
                  {pedido.estado === "entregado" && <span>Entregado</span>}
                  {pedido.estado === "cancelado" && <span>Cancelado</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PedidosCrud;
