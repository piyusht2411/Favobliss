"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Custom Next Arrow Component
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer z-10 hover:bg-gray-200"
      onClick={onClick}
    >
      <ChevronRight size={24} className="text-gray-800" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer z-10 hover:bg-gray-200"
      onClick={onClick}
    >
      <ChevronLeft size={24} className="text-gray-800" />
    </div>
  );
};

const HotDealSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const slides = [
    {
      id: 1,
      image: "/assets/hero/banner1.webp",
    },
    {
      id: 2,
      image: "/assets/hero/banner2.webp",
    },
    {
      id: 3,
      image: "/assets/hero/banner3.webp",
    },
  ];

  return (
    <div className="relative w-full mx-auto h-[60vh] sm:h-[70vh] md:h-[80vh]">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] rounded-lg overflow-hidden"
          >
            <Image
              src={slide.image}
              alt={`Slide ${slide.id}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HotDealSlider;
