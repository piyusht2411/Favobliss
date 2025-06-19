import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CategorySlider() {
  const categories = [
    {
      name: "PHONES",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/mobile-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/mobile-640x640.png",
      alt: "Phones",
    },
    {
      name: "AUDIO & VIDEO",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/audio-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/audio-640x640.png",
      alt: "Audio & Video",
    },
    {
      name: "WEARABLES",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/werables-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/werables-640x640.png",
      alt: "Wearables",
    },
    {
      name: "REFRIGERATORS",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/refrigerator-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/refrigerator-640x640.png",
      alt: "Refrigerators",
    },
    {
      name: "WASHING MACHINES",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/washing%20machine-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/washing%20machine-640x640.png",
      alt: "Washing Machines",
    },
    {
      name: "HEALTH CARE",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/groming-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/groming-640x640.png",
      alt: "Health Care",
    },
    {
      name: "CAMERAS",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/camera-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/camera-640x640.png",
      alt: "Cameras",
    },
    {
      name: "LAPTOPS",
      image:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/laptop-320x320.png",
      image2x:
        "https://www.favobliss.com/image/cache/catalog/Banners/brand%20icon%20and%20logo/laptop-640x640.png",
      alt: "Laptops",
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-8">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[12.5%]"
            >
              <div className="group">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 rounded-full bg-black border-4 border-orange-500 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-orange-400">
                  <img
                    src={category.image}
                    alt={category.alt}
                    className="w-full h-full object-contain p-3 filter"
                    srcSet={`${category.image} 1x, ${category.image2x} 2x`}
                    loading="lazy"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider leading-tight group-hover:text-orange-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12  border-2 border-gray-200 hover:bg-orange-50 hover:border-orange-300" />
        <CarouselNext className="hidden md:flex -right-12  border-2 border-gray-200 hover:bg-orange-50 hover:border-orange-300" />
      </Carousel>
    </div>
  );
}
