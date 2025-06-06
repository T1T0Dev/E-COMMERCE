import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cube';
import '../../Estilos/Carrusel.css'; // Assuming you have a CSS file for styling the carousel
import { Navigation, Pagination, Autoplay, EffectCube } from 'swiper/modules';

const Carrusel = () => {
  return (
    <div className="carrusel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCube]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        direction="horizontal"
        effect="cube"
        spaceBetween={30}
        slidesPerView={1}
      >
        <SwiperSlide>
          <div className="carrusel-slide">
            <img src="src/Resources/imgr1.jpg" alt="Slide 1" className="carrusel-img" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="carrusel-slide">
            <img src="src/Resources/imgr2.jpg" alt="Slide 2" className="carrusel-img" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="carrusel-slide">
            <img src="src/Resources/imgr3.jpg" alt="Slide 3" className="carrusel-img" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carrusel;
