"use client";
import React, { useCallback, useEffect, useState } from "react";
import LandingPageSection from "../LandingPageSection";
import { ProductList } from "./product-list";
import { LocationGroup, Product } from "@/types";
import { getProducts } from "@/actions/get-products";
import { ProductSkeleton } from "./product-skeleton";

interface Props {
  categoryId: string;
  locationGroups: LocationGroup[];
  link: string;
  items: any;
  title: string;
  className?: string;
}

const HomeAppliance = (props: Props) => {
  const { categoryId, locationGroups, link, items, title, className } = props;
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (id: string) => {
    fetchProducts(id);
  };

  const fetchProducts = useCallback(
    async (id?: string) => {
      try {
        setLoading(true);
        const { products } = await getProducts({
          subCategoryId: id,
          categoryId,
        });
        setData(products);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching products:", error);
      }
    },
    [categoryId]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <LandingPageSection
        title={title}
        items={items}
        viewAllLink={link}
        className={`mx-auto ${className}`}
        handleCategoryChange={handleCategoryChange}
      />
      {loading ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:overflow-y-hidden max-h-[350px] mt-4">
          <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px] md:h-[unset]" />
          <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
          <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
          <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
        </div>
      ) : (
        <ProductList
          title=""
          data={data || []}
          locationGroups={locationGroups || []}
        />
      )}
    </div>
  );
};

export default HomeAppliance;
