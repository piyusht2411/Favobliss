"use client";
import React, { useCallback, useEffect, useState } from "react";
import LandingPageSection from "../LandingPageSection";
import { ProductList } from "./product-list";
import { LocationGroup, Product } from "@/types";
import { getProducts } from "@/actions/get-products";

interface Props {
  categoryId: string;
  locationGroups: LocationGroup[];
  link: string;
  items: any;
  title: string;
}

const HomeAppliance = (props: Props) => {
  const { categoryId, locationGroups, link, items, title } = props;
  const [data, setData] = useState<Product[]>([]);

  const handleCategoryChange = (id: string) => {
    fetchProducts(id);
  };

  const fetchProducts = useCallback(
    async (id?: string) => {
      try {
        const { products } = await getProducts({
          subCategoryId: id,
          categoryId,
        });
        setData(products);
      } catch (error) {
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
        title={title || "Home Appliances"}
        items={items}
        viewAllLink={link}
        className="mx-auto bg-[#d8d8d8]"
        handleCategoryChange={handleCategoryChange}
      />
      <ProductList
        title=""
        data={data || []}
        locationGroups={locationGroups || []}
      />
    </div>
  );
};

export default HomeAppliance;
