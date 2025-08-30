"use client";

import { Brand } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  brands: Brand[];
}

const BrandList = ({ brands }: Props) => {
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(`/brand/${path}?page=1`);
  };

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div className="bg-transparent py-8 md:py-12">
      <div className="px-4 text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Explore Official Brand Stores
        </h2>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {brands.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-[22.22%] xs:basis-[22.22%] sm:basis-[22.22%] md:basis-1/6 lg:basis-[13.33%] xl:basis-[13.33%] pl-4"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center rounded-full overflow-hidden cursor-pointer bg-[#e5e4e4] p-1 md:p-2"
                    onClick={() => handleClick(item?.slug)}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={item.cardImage || "/placeholder-brand.png"}
                        alt={item.name || "Brand"}
                        fill
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                        className="object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-brand.png";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation arrows - only show on larger screens */}
          {/* <CarouselPrevious
            className="hidden md:flex -left-4 lg:-left-12 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 transition-all duration-200"
          />
          <CarouselNext
            className="hidden md:flex -right-4 lg:-right-12 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 transition-all duration-200"
          /> */}
        </Carousel>
      </div>
    </div>
  );
};

export default BrandList;
