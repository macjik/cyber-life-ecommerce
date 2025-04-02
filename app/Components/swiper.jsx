'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ImageSwiper({images}) {
  return (
    <div className="w-full h-64 relative pt-2">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="h-full"
      >
        {images.map((imgUrl, index) => (
          <SwiperSlide key={index}>
            <Image
              fill
              quality={100}
              sizes="80vw"
              style={{ objectFit: 'contain' }}
              className="rounded-t-lg transition-transform duration-500 group-hover:scale-110"
              src={imgUrl}
              alt={`Product image ${index + 1}`}
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
