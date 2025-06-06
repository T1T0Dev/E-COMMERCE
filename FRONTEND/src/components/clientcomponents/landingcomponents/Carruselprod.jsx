import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../Estilos/Carruselprod.css';
import { FaShoppingCart } from 'react-icons/fa';
import '../../Estilos/Carruselprod.css'; // Assuming you have a CSS file for styling the carousel
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import productos from './Productos';


const Carruselprod = () => {
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
                                key={producto.id}
                                className="carruselprod-slide flex justify-center items-center"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <div className="carruselprod-card bg-white rounded-xl shadow-md flex flex-col overflow-hidden h-[480px] mx-auto">
                                    <div className="carruselprod-img-wrapper w-full h-64 overflow-hidden flex items-center justify-center">
                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                            className="carruselprod-img w-full h-64 object-cover"
                                            style={{ maxWidth: '100%', maxHeight: '16rem', minHeight: '16rem', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="carruselprod-info p-4 flex flex-col justify-between flex-grow">
                                        <div>
                                            <h3 className="carruselprod-title text-lg font-semibold">{producto.nombre}</h3>
                                            <h2 className="carruselprod-price text-xl font-bold text-gray-800 mt-2">{producto.precio}</h2>
                                            <p className="carruselprod-desc text-gray-500 text-sm mt-1">{producto.descripcion}</p>
                                            <button className="carruselCart">
  <FaShoppingCart />
   Agregar al carrito
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
