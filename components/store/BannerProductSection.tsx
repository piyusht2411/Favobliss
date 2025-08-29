"use client";

import React from "react";
import Image from "next/image";
import { LocationGroup, Product } from "@/types";
import { ProductCard } from "./product-card";

interface Props {
  bannerImage: string;
  products: Product[];
  locationGroups: LocationGroup[];
}

const BannerProductSection = (props: Props) => {
  const {
    bannerImage = "/api/placeholder/300/400",
    products,
    locationGroups,
  } = props;

  return (
    <div className="w-full bg-[#292928] py-2 md:py-2 rounded-3xl pr-2">
      <div className="max-w-full mx-auto px-2">
        <div className="lg:hidden flex flex-col gap-5">
          <div className="w-full h-48">
            <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
              <Image
                src={bannerImage}
                alt="Banner"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Products below banner for mobile */}
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[180px]">
                  <ProductCard data={product} locationGroups={locationGroups} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex gap-6 h-[375px]">
          {/* Left Banner - Fixed */}
          <div className="flex-shrink-0 w-[300px] xl:w-[350px]">
            <div className="relative w-full h-[375px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
              <Image
                src={bannerImage}
                alt="Banner"
                fill
                className="object-cover"
                sizes="350px"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="flex gap-4 overflow-x-auto pb-2 h-[400px]"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[220px] xl:w-[260px]"
                >
                  <div className="h-full">
                    <ProductCard
                      data={product}
                      locationGroups={locationGroups}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbar */
        div::-webkit-scrollbar {
          display: none;
        }

        /* For Firefox */
        div {
          scrollbar-width: none;
        }

        /* For IE */
        div {
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default BannerProductSection;
