"use client";

import { Brand } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

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
      <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
        {brands?.map((item) => (
          <div
            key={item.id}
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
        ))}
      </div>
    </div>
  );
};

export default BrandList;
