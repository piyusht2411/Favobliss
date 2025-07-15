"use client";

import { Product, Location } from "@/types";
import { NoResults } from "./no-results";
import { ProductCard } from "./product-card";

interface ProductListProps {
  title: string;
  data: Product[];
  locations: Location[];
  isSpaceTop?: boolean;
}

export const ProductList = ({
  title,
  data,
  locations,
  isSpaceTop = true,
}: ProductListProps) => {
  return (
    <div className="space-y-2 md:space-y-8">
      <h3 className="text-3xl font-bold">{title}</h3>
      {data.length === 0 && <NoResults />}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 ${
          isSpaceTop ? "mt-0!" : ""
        }`}
        style={isSpaceTop ? { marginTop: "0px" } : {}}
      >
        {data.slice(0, 5).map((product) => (
          <ProductCard key={product.id} data={product} locations={locations} />
        ))}
      </div>
    </div>
  );
};
