"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Smartphone,
  Wind,
  Tv,
  WashingMachine,
  Lightbulb,
  ChefHat,
  Printer,
  Sparkles,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Category icon mapping with unique icons and fallbacks
const categoryIcons = {
  ELECTRONICS: Smartphone,
  "AIR CONDITIONERS": Wind,
  TELEVISION: Tv,
  "WASHING MACHINE": WashingMachine,
  "HOME APPLIANCES": Lightbulb,
  "KITCHEN APPLIANCES": ChefHat,
  "COMPUTER & PRINTER": Printer,
  "PERSONAL CARE": Sparkles,
};

interface Props {
  categories: any[];
}

export function CategorySlider(props: Props) {
  const { categories } = props;
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}?page=1`);
  };

  return (
    <div className="w-full bg-white py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <CarouselContent className="-ml-1 justify-between">
          {categories.map((category, index) => {
            const IconComponent =
              categoryIcons[category.name as keyof typeof categoryIcons] ||
              Home;

            return (
              <CarouselItem
                key={category.id}
                className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[12.5%] 2xl:basis-[10%]"
              >
                <div
                  className="group cursor-pointer"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-orange-500 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center">
                    <IconComponent
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group-hover:text-orange-300 transition-colors duration-300"
                      strokeWidth={1.5}
                    />

                    {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/10 group-hover:to-orange-600/20 transition-all duration-300 rounded-full"></div> */}
                  </div>

                  <div className="text-center px-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide leading-tight group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* 
        <CarouselPrevious className="hidden md:flex -left-12 bg-white border-2 border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300" />
        <CarouselNext className="hidden md:flex -right-12 bg-white border-2 border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300" /> */}
      </Carousel>
    </div>
  );
}
