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
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

const defaultCategoryImages = {
  electronics: "/assets/category/air-conditioner.png",
  "air conditioners": "/assets/category/air-conditioner.png",
  television: "/assets/category/television.png",
  "washing machine": "/assets/category/air-conditioner.png",
  "home appliances": "/assets/category/air-conditioner.png",
  "kitchen appliances": "/assets/category/kitchen-appliance.png",
  "computer & printer": "/assets/category/computer-printer.png",
  "personal care": "/assets/category/personal-care.png",
  "air purifier": "/assets/category/air-purifier.png",
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
    // First try to use the category's own image if available
    // if (category.image) return category.image;

    // Then try to match by lowercase category name
    const lowerCaseName = category.name.toLowerCase();
    if (defaultCategoryImages.hasOwnProperty(lowerCaseName)) {
      return defaultCategoryImages[
        lowerCaseName as keyof typeof defaultCategoryImages
      ];
    }

    // Fallback to default image
    return "/assets/category/air-conditioner.png";
  };

  return (
    <div className="w-full bg-white py-8">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full max-w-7xl mx-auto px-4"
      >
        <CarouselContent className="-ml-1 justify-between">
          {categories.map((category, index) => {
            // const imageSrc =
            //   categoryImages[category.name as keyof typeof categoryImages] ||
            //   "/assets/category/air-conditioner.png";
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
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 mx-auto mb-3 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25">
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

                  {/* <div className="text-center px-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide leading-tight group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                      {category.name}
                    </h3>
                  </div> */}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
