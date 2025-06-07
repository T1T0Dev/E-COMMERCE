import React from "react";
import useCarritoStore from "../../../store/useCarritoStore";
import './estiloslanding/Carrito.css'; // Asegúrate de tener un archivo CSS para estilos

const Carrito = ({ onClose, onEnviarPedido }) => {
  const { items } = useCarritoStore();

  const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="carrito-modal">
      <div className="carrito-content">
        <h2>Tu Carrito</h2>
        {items.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                <strong>{item.nombre_producto}</strong> - Talle: {item.nombre_talle} <br />
                Cantidad: {item.cantidad} <br />
                Precio: ${item.precio}
              </li>
            ))}
          </ul>
        )}
        <div className="carrito-total">
          <strong>Total: ${total}</strong>
        </div>
        <button onClick={onEnviarPedido} className="carrito-btn-enviar">Enviar Pedido</button>
        <button onClick={onClose} className="carrito-btn-cerrar">Cerrar</button>
      </div>
    </div>
  );
};

export default Carrito;