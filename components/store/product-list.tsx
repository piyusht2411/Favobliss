"use client";

import { Product, Location } from "@/types";
import { NoResults } from "./no-results";
import { ProductCard } from "./product-card";
import Link from "next/link";

interface ProductListProps {
  title: string;
  data: Product[];
  locations: Location[];
  isSpaceTop?: boolean;
  isBannerProduct?: boolean;
  showViewAll?: boolean;
  link?: string;
}

export const ProductList = ({
  title,
  data,
  locations,
  isSpaceTop = true,
  isBannerProduct = false,
  showViewAll = false,
  link = "/latest-launches?page=1",
}: ProductListProps) => {
  return (
    <div className="space-y-2 md:space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold mb-5">{title}</h3>
        {showViewAll && (
          <Link href={link} className="text-gray-500 underline text-sm">
            View All
          </Link>
        )}
      </div>

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
            className={`flex-none w-[45vw] sm:w-[30vw] md:w-[18vw] lg:w-[18vw] ${
              isBannerProduct ? "xl:w-[16vw]" : "xl:w-[17vw]"
            } snap-start`}
          >
            <ProductCard data={product} locations={locations} />
          </div>
        ))}
      </div>
    </div>
  );
};
