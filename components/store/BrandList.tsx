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

  return (
    <div className="bg-white py-12 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Discover Leading Brands
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {brands?.slice(0, 8).map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:pl-4 basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[12.5%]"
            >
              <div
                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                onClick={() => handleClick(item?.slug)}
              >
                <Image
                  src={item.cardImage || ""}
                  alt={item.name || "brand image"}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious
          className="hidden md:flex -left-12 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
          disabled={false} // Controlled by carousel internal state
        />
        <CarouselNext
          className="hidden md:flex -right-12 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
          disabled={false} // Controlled by carousel internal state
        /> */}
      </Carousel>
    </div>
  );
};

export default BrandList;
