"use client";

import { LocationGroup, Product } from "@/types";
import { NoResults } from "./no-results";
import { ProductCard } from "./product-card";
import Link from "next/link";

interface ProductListProps {
  title: string;
  data: Product[];
  locationGroups: LocationGroup[];
  isSpaceTop?: boolean;
  isBannerProduct?: boolean;
  showViewAll?: boolean;
  link?: string;
  className?: string;
}

export const ProductList = ({
  title,
  data,
  locationGroups,
  isSpaceTop = true,
  isBannerProduct = false,
  showViewAll = false,
  link = "/latest-launches?page=1",
  className,
}: ProductListProps) => {
  return (
    <div className="space-y-2 md:space-y-8">
      {title.length > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-3xl lg:text-4xl font-bold mb-0 md:mb-5">
            {title}
          </h3>
          {showViewAll && (
            <Link href={link} className="text-gray-500 text-sm">
              View All
            </Link>
          )}
        </div>
      )}

      {data.length === 0 && <NoResults />}
      <div
        className={`flex flex-row overflow-x-auto gap-4 md:gap-4 mb-2 snap-x snap-mandatory py-3 scrollbar-hide ${
          isSpaceTop ? "mt-0!" : ""
        }`}
        style={isSpaceTop ? { marginTop: "0px" } : {}}
      >
        {data.slice(0, 5).map((product) => (
          <div
            key={product.id}
            className={`flex-none w-[45vw] sm:w-[30vw] md:w-[25vw] lg:w-[25vw] ${className} ${
              isBannerProduct ? "xl:w-[16vw]" : "xl:w-[17vw]"
            } snap-start`}
          >
            <ProductCard data={product} locationGroups={locationGroups} />
          </div>
        ))}
      </div>
    </div>
  );
};
