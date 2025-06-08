import React, { useEffect, useState } from "react";
import useCarritoStore from "../store/useCarritoStore";
import axios from "axios";
import Header from "../components/clientcomponents/landingcomponents/Header";
import Footer from "../components/clientcomponents/landingcomponents/Footer";
import "./styles/Catalogo.css";

const Catalogo = () => {
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productos, setProductos] = useState([]);
  const [talleSeleccionado, setTalleSeleccionado] = useState({});
  const { agregarAlCarrito, items } = useCarritoStore();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getCantidadEnCarrito = (productoId, idTalle) => {
    const item = items.find((i) => i.id === productoId && i.id_talle === idTalle);
    return item ? item.cantidad : 0;
  };

  const handleTalleChange = (productoId, idTalle) => {
    setTalleSeleccionado((prev) => ({
      ...prev,
      [productoId]: idTalle,
    }));
  };

  return (
     <div className={`catalogo-page${mostrarCarrito ? " carrito-abierto" : ""}`}>
      <Header setMostrarCarrito={setMostrarCarrito} />
      <main>
        <h2 className="title-catalogo">Catálogo de Productos</h2>
        <div className="catalogo-container">
          {productos.map((producto) => {
            const stockTotal = producto.talles?.reduce((acc, t) => acc + t.stock, 0) || 0;
            const idTalleSel = talleSeleccionado[producto.id_producto];
            const talleActual = producto.talles?.find((t) => t.id_talle === Number(idTalleSel));
            return (
              <div className="producto-card" key={producto.id_producto}>
                {producto.imagen_producto && (
                  <img
                    src={`http://localhost:3000${producto.imagen_producto}`}
                    alt={producto.nombre_producto}
                    className="producto-img"
                  />
                )}
                <h3>{producto.nombre_producto}</h3>
                <p>{producto.descripcion}</p>
                <p>
                  {stockTotal > 0 ? (
                    <span className="stock-ok">STOCK DISPONIBLE</span>
                  ) : (
                    <span className="stock-no">NO HAY STOCK DISPONIBLE</span>
                  )}
                </p>
                <div>
                  <label>
                    Talle:&nbsp;
                    <select
                      value={idTalleSel || ""}
                      onChange={(e) => handleTalleChange(producto.id_producto, e.target.value)}
                      disabled={stockTotal === 0}
                    >
                      <option value="">Seleccionar talle</option>
                      {producto.talles?.filter(t => t.stock > 0).map((talle) => (
                        <option key={talle.id_talle} value={talle.id_talle}>
                          {talle.nombre_talle}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="card-actions">
                  <button
                    className="agregar-btn"
                    disabled={
                      stockTotal === 0 ||
                      !idTalleSel ||
                      (talleActual && getCantidadEnCarrito(producto.id_producto, talleActual.id_talle) >= talleActual.stock)
                    }
                    onClick={() =>
                      agregarAlCarrito({
                        ...producto,
                        id_talle: Number(idTalleSel),
                        nombre_talle: talleActual?.nombre_talle,
                      })
                    }
                  >
                    Agregar al carrito
                  </button>
                  <span className="cantidad-carrito">
                    {idTalleSel &&
                      getCantidadEnCarrito(producto.id_producto, Number(idTalleSel)) > 0 &&
                      `En carrito: ${getCantidadEnCarrito(producto.id_producto, Number(idTalleSel))}`}
                  </span>
                </div>
              </div>
            );
          })}
          {productos.length === 0 && <p>Cargando productos...</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalogo;