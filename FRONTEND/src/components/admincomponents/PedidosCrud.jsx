import React, { useEffect, useState } from "react";
import axios from "axios";
import "./estilosadmin/Pedidos.css";
import { toast } from "react-toastify";

const PedidosCrud = () => {
  const [pedidos, setPedidos] = useState([]);

  // Cargar pedidos con JOIN
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const res = await axios.get("http://localhost:3000/api/pedidos/join");
    setPedidos(res.data);
  };

  // Cambiar estado del pedido
  const cambiarEstado = async (id_pedido, nuevoEstado, id_carrito, id_cliente) => {
    try {
      // 1. Cambiar estado del pedido
      await axios.put(`http://localhost:3000/api/pedidos/${id_pedido}/estado`, {
        estado: nuevoEstado,
      });

      // 2. Actualizar estado del carrito relacionado (si corresponde)
      if (id_carrito) {
        await axios.put(`http://localhost:3000/api/carritos/${id_carrito}/estado`, {
          estado: "enviado",
        });
      }

      // 3. Si se confirma, mostrar mensaje al cliente (simulado con toast)
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

  return (
    <div className="pedidos-crud-container">
      <h2>Gestión de Pedidos</h2>
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
          {pedidos.map((pedido) => (
            <tr key={pedido.id_pedido}>
              <td>{pedido.id_pedido}</td>
              <td>{pedido.nombre_cliente} {pedido.apellido_cliente}</td>
              <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
              <td>{pedido.estado}</td>
              <td>
                {pedido.detalles.map((detalle) => (
                  <div key={detalle.id_detalle}>
                    {detalle.nombre_producto} ({detalle.nombre_talle}) x{detalle.cantidad}
                  </div>
                ))}
              </td>
              <td>
                $
                {pedido.detalles.reduce(
                  (acc, d) => acc + d.subtotal,
                  0
                )}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidosCrud;