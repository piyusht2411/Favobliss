"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const defaultCategoryImages = {
  "air conditioners": "/assets/category/air-conditioner.png",
  television: "/assets/category/television.png",
  "washing machine": "/assets/category/washing-machine.png",
  "home appliances": "/assets/category/air-conditioner.png",
  "kitchen appliances": "/assets/category/kitchen-appliance.png",
  laptop: "/assets/category/computer-printer.png",
  "personal care": "/assets/category/personal-care.png",
  "air purifier": "/assets/category/air-purifier.png",
  "water purifiers": "/assets/category/water-purifier.png",
  "home audio": "/assets/category/home-audio.png",
  "air coolers": "/assets/category/air-cooler.png",
  watch: "/assets/category/watch.png",
  refrigerator: "/assets/category/refrigerator.png",
  mobiles: "/assets/category/mobiles.png",
  "gas stove": "/assets/category/gas-stove.png",
  chimney: "/assets/category/chimney.png",
  printers: "/assets/category/printer.png",
};

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

export function CategorySlider(props: Props) {
  const { categories } = props;
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}?page=1`);
  };

  const getImageSrc = (category: Category) => {
    const lowerCaseName = category.name.toLowerCase();
    if (defaultCategoryImages.hasOwnProperty(lowerCaseName)) {
      return defaultCategoryImages[
        lowerCaseName as keyof typeof defaultCategoryImages
      ];
    }
    return "/assets/category/air-conditioner.png";
  };

  // Mobile/Tablet Grid Layout
  const MobileGridLayout = () => (
    <div className="block md:hidden w-full bg-white py-5 md:py-8 pb-0">
      <div className="px-4">
        <div
          className="grid grid-rows-2 gap-y-4 overflow-x-auto pb-4"
          style={{
            gridTemplateColumns: "repeat(11, minmax(100px, 1fr))", // Adjusted for 3.5 categories per row
            width: "calc(100vw - 2rem)",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category, index) => {
            const imageSrc = getImageSrc(category);
            const isFirstRow = index < Math.ceil(categories.length / 2);

            return (
              <div
                key={category.id}
                className="group cursor-pointer flex flex-col items-center"
                onClick={() => handleCategoryClick(category.slug)}
                style={{
                  gridRow: isFirstRow ? 1 : 2,
                  gridColumn: isFirstRow
                    ? index + 1
                    : index - Math.ceil(categories.length / 2) + 1,
                }}
              >
                <div className="relative w-20 h-20 sm:w-20 sm:h-20 mx-auto mb-2 overflow-hidden transition-all duration-300 bg-gray-50 rounded-lg">
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    fill
                    className="object-cover p-1 group-hover:opacity-90 transition-opacity duration-300"
                    sizes="56px"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/assets/category/air-conditioner.png";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const DesktopCarouselLayout = () => (
    <div className="hidden md:block w-full bg-white py-8">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <CarouselContent
          className="-ml-1 justify-between overflow-x-auto touch-auto"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category, index) => {
            const imageSrc = getImageSrc(category);

            return (
              <CarouselItem
                key={category.id}
                className="pl-1 basis-1/4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[12.5%] 2xl:basis-[10%]"
              >
                <div
                  className="group cursor-pointer"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 mx-auto mb-3 overflow-hidden transition-all duration-300">
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      className="object-cover p-2 group-hover:opacity-90 transition-opacity duration-300"
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/assets/category/air-conditioner.png";
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );

  return (
    <>
      <MobileGridLayout />
      <DesktopCarouselLayout />
    </>
  );
}
