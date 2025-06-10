import axios from "axios";
import useCarritoStore from "../../../store/useCarritoStore";
import "./estiloslanding/Carrito.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Carrito = ({ open, onClose }) => {
  const { items, limpiarCarrito, eliminarProducto, cambiarCantidad } =
    useCarritoStore();
  const id_cliente = 1; // ← Usa el id_cliente real del usuario logueado

  const total = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handleHacerPedido = async () => {
    // 1. Validar stock real en backend
    for (const item of items) {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/productos/stock/${item.id_producto}/${item.id_talle}`
        );
        const stockReal = res.data.stock;
        if (item.cantidad > stockReal) {
          toast.error(
            `No hay suficiente stock para "${item.nombre_producto}" (Talle: ${item.nombre_talle}). Stock disponible: ${stockReal}. Por favor, ajusta la cantidad.`,
            { position: "top-center", autoClose: 4000 }
          );
          return;
        }
      } catch (error) {
        toast.error(
          `Error al consultar stock para "${item.nombre_producto}" (Talle: ${item.nombre_talle}).`,
          { position: "top-center", autoClose: 4000 }
        );
        return;
      }
    }

    try {
      // 2. Crear el carrito
      const carritoRes = await axios.post("http://localhost:3000/api/carrito", {
        id_cliente,
      });
      const id_carrito = carritoRes.data.id_carrito;

      // 3. Agregar productos al carrito
      for (const item of items) {
        await axios.post("http://localhost:3000/api/carrito/item", {
          id_carrito,
          id_producto: item.id_producto,
          id_talle: item.id_talle,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad,
        });
      }

      // 4. Crear el pedido (¡ahora sí con id_carrito!)
      const itemsPedido = items.map((item) => ({
        id_producto: item.id_producto,
        id_talle: item.id_talle,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad,
      }));

      await axios.post("http://localhost:3000/api/pedidos", {
        id_cliente,
        id_carrito,
        items: itemsPedido,
      });

      toast.success("¡Pedido enviado correctamente!");
      limpiarCarrito();
      onClose();
    } catch (error) {
      toast.error("Error al enviar el pedido.");
    }
  };

  const handleEliminarProducto = (id, id_talle) => {
    eliminarProducto(id, id_talle);
    toast.info("Producto eliminado del carrito");
    // Si quieres llamar al backend, hazlo aquí con axios
  };

  const handleLimpiarCarrito = () => {
    limpiarCarrito();
    toast.info("Carrito vaciado");
    // Si quieres llamar al backend, hazlo aquí con axios
  };

  return (
    <div className={`carrito-drawer${open ? " open" : ""}`}>
      <div className="carrito-drawer-content">
        <h2 className="carrito-title">TU CARRITO 🛒 </h2>
        <ul className="carrito-productos-lista">
          {items.length === 0 ? (
            <li className="carrito-item">El carrito está vacío.</li>
          ) : (
            items.map((item, idx) => (
              <li key={idx} className="carrito-item">
                <strong>{item.nombre_producto}</strong> - Talle:{" "}
                {item.nombre_talle} <br />
                Cantidad:
                <button
                  className="carrito-cantidad-btn"
                  onClick={() =>
                    cambiarCantidad(
                      item.id,
                      item.id_talle,
                      Math.max(1, item.cantidad - 1)
                    )
                  }
                  disabled={item.cantidad <= 1}
                  title="Restar"
                >
                  -
                </button>
                <span style={{ margin: "0 8px" }}>{item.cantidad}</span>
                <button
                  className="carrito-cantidad-btn"
                  onClick={() =>
                    cambiarCantidad(item.id, item.id_talle, item.cantidad + 1)
                  }
                  title="Sumar"
                >
                  +
                </button>
                <br />
                Precio: ${item.precio}
                <br />
                <button
                  className="carrito-eliminar-btn"
                  onClick={() => handleEliminarProducto(item.id, item.id_talle)}
                >
                  Eliminar
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="carrito-bottom">
          <div className="carrito-total">
            <strong>Total: ${total}</strong>
          </div>
          <button
            onClick={handleHacerPedido}
            className="carrito-btn-enviar"
            disabled={items.length === 0}
          >
            Enviar Pedido
          </button>
          <button
            onClick={handleLimpiarCarrito}
            className="carrito-btn-cerrar"
            style={{
              background: "#b91c1c",
              color: "#fff",
              marginBottom: "0.5rem",
            }}
            disabled={items.length === 0}
          >
            Vaciar Carrito
          </button>
          <button onClick={onClose} className="carrito-btn-cerrar">
            Cerrar
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Carrito;
