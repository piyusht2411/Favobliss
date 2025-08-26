"use client";

import { useEffect, useState } from "react";
import { ProductList } from "@/components/store/product-list";
import { LocationGroup, Product } from "@/types";
import { getRecentlyViewed } from "@/lib/utils";
import { getRecentlyViewedProducts } from "@/actions/get-product";

interface RecentlyViewedProps {
  locationGroups: LocationGroup[];
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ locationGroups }) => {
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
    Product[]
  >([]);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const productIds = getRecentlyViewed();
      if (productIds.length > 0) {
        try {
          const products = await getRecentlyViewedProducts(productIds);
          setRecentlyViewedProducts(products);
        } catch (error) {
          console.error("[RECENTLY_VIEWED_FETCH]", error);
        }
      }
    };
    fetchRecentlyViewed();
  }, []);

  if (recentlyViewedProducts.length === 0) return null;

  return (
    <ProductList
      title="Recently Viewed"
      data={recentlyViewedProducts}
      locationGroups={locationGroups}
    />
  );
};

export default RecentlyViewed;
