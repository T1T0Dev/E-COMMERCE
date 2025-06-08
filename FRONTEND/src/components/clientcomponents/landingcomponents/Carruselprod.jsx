import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../landingcomponents/estiloslanding/Carruselprod.css";
import { FaShoppingCart } from "react-icons/fa";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";


const Carruselprod = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/productos");
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
    return <div className="text-white text-center">Cargando productos...</div>;

    return (
        <div className="carruselprod-container w-full h-full flex justify-center items-center">
            <div className="carruselprod-inner w-full flex justify-center items-center">
                <div className="carruselprod-wrapper w-full max-w-6xl flex justify-center items-center">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000 }}
                        loop={true}
                        spaceBetween={20}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="carruselprod-swiper !flex !justify-center !items-center"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {productos.map((producto) => (
                            <SwiperSlide
                                key={producto.id_producto}
                                className="carruselprod-slide flex justify-center items-center"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <div className="carruselprod-card bg-white rounded-xl shadow-md flex flex-col overflow-hidden h-[480px] mx-auto">
                                    <div className="carruselprod-img-wrapper w-full h-64 overflow-hidden flex items-center justify-center">
                                        <img
                                            src={producto.imagen_producto}
                                            alt={producto.nombre_producto}
                                            className="carruselprod-img w-full h-64 object-cover"
                                            style={{ maxWidth: '100%', maxHeight: '16rem', minHeight: '16rem', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="carruselprod-info p-4 flex flex-col justify-between flex-grow">
                                        <div>
                                            <h3 className="carruselprod-title text-lg font-semibold">{producto.nombre_producto}</h3>
                                            <h2 className="carruselprod-price text-xl font-bold text-gray-800 mt-2">${producto.precio}</h2>
                                            <p className="carruselprod-desc text-gray-500 text-sm mt-1">{producto.nombre_categoria}</p>
                                          <div className="carrusel-btn-wrapper">
    <button onClick={() => navigate("/Catalogo")} className="carruselCart ">
        <span>LO QUIERO YA</span>
        <span className="flecha">↗</span>
    </button>
</div>
                                            <button  onClick={() => navigate("/Catalogo")}className="carruselCart">
                                                <FaShoppingCart />
                                                LO QUIERO YA
                                            </button>
                                        </div>
                                        <div className="carruselprod-footer mt-4"></div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default Carruselprod;
