import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles/Carruselprod.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const Carruselprod = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/productos?activo=1");
        setProductos(res.data);
      } catch (err) {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  if (loading)
    return <div className="carruselprod-loading">Cargando productos...</div>;

  return (
    <div className="carruselprod-outer">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500 }}
        loop={true}
        spaceBetween={32}
        breakpoints={{
          0: { slidesPerView: 1 },
          700: { slidesPerView: 2 },
          1100: { slidesPerView: 3 },
        }}
        className="carruselprod-swiper"
      >
        {productos.map((producto) => (
          <SwiperSlide
            key={producto.id_producto}
            className="carruselprod-slide"
          >
            <div className="carruselprod-card glass-modern">
              <div className="carruselprod-img-wrapper glass-modern-img">
                <div className="carruselprod-title-overlay glass-title">
                  {producto.nombre_producto}
                </div>
                <img
                  src={`http://localhost:3000${producto.imagen_producto}`}
                  alt={producto.nombre_producto}
                  className="carruselprod-img"
                  loading="lazy"
                />
              </div>
              <div className="carruselprod-info">
                <div className="carruselprod-price glass-price">
                  ${formatPrice(producto.precio)}
                </div>
                <p className="carruselprod-desc">{producto.descripcion}</p>
                <button
                  onClick={() => navigate("catalogo")}
                  className="carruselprod-btn glass-btn"
                >
                  ¡LO QUIERO YA!{" "}
                  <span className="carruselprod-btn-icon">🛒</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carruselprod;
