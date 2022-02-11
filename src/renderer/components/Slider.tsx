// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { ReactNode } from 'rehype-react/lib';

export type SliderProps = {
  children: ReactNode[];
  mask?: string;
};
export const Slider = ({ children, ...props }: SliderProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      spaceBetween={50}
      slidesPerView={1}
    >
      {children
        .filter(c => typeof c === 'object')
        .map((c, i) => (
          <SwiperSlide key={i}>{c}</SwiperSlide>
        ))}
    </Swiper>
  );
};
