'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState, useEffect } from 'react';

export default function ImageSwiper({ images }) {
  return (
    <div className="w-full h-full relative">
      <Swiper
        modules={[Navigation, Pagination, Zoom]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="h-full"
        zoom
      >
        {images.map((imgUrl, index) => (
          <SwiperSlide key={index}>
            <ContainedImageWithBackground imgUrl={imgUrl} index={index} isFirst={index === 0} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function ContainedImageWithBackground({ imgUrl, index, isFirst }) {
  const [bgColor, setBgColor] = useState('#f0f0f0');

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 20;
      canvas.height = 20;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 20, 20);

      const pixelData = ctx.getImageData(0, 0, 20, 20).data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < pixelData.length; i += 4) {
        r += pixelData[i];
        g += pixelData[i + 1];
        b += pixelData[i + 2];
      }

      const avgR = Math.round(r / (pixelData.length / 4));
      const avgG = Math.round(g / (pixelData.length / 4));
      const avgB = Math.round(b / (pixelData.length / 4));

      setBgColor(`rgb(${avgR},${avgG},${avgB})`);
    };
  }, [imgUrl]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute inset-0 -z-10 blur-2xl opacity-80"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: bgColor,
        }}
      />

      <div className="relative w-[90%] h-[80%] max-w-3xl">
        <Image
          fill
          src={imgUrl}
          quality={100}
          sizes="100vw"
          style={{ objectFit: 'contain' }}
          className="rounded-t-lg transition-transform duration-300 hover:scale-105"
          alt={`Product image ${index + 1}`}
          priority={isFirst}
        />
      </div>
    </div>
  );
}
