"use client";

import { Category, LocationGroup, Product } from "@/types";
import React, { useEffect, useState } from "react";
import { ProductList } from "./product-list";
import { getProducts } from "@/actions/get-products";
import { ProductSkeleton } from "./product-skeleton";

interface Props {
  data: Product[];
  locationGroups: LocationGroup[];
  categories: Category[];
}

const PromotionalBanner = (props: Props) => {
  const { data, locationGroups, categories } = props;
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<string | null>(null);
  const [product, setProduct] = useState<Product[]>(data);

  const categoryChange = (id: string) => {
    setCategory(id);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { products: productData } = await getProducts({
        subCategoryId: category || "",
      });
      setProduct(productData);
      setLoading(false);
    };
    getData();
  }, [category]);

  return (
    <div className="w-full max-w-full mx-auto">
      <div
        className="relative rounded-3xl sm:rounded-2xl lg:rounded-3xl overflow-hidden 
             bg-center bg-no-repeat flex items-end 
             min-h-[40vh] sm:min-h-[80vh] lg:min-h-[120vh] 
             p-3 sm:p-4 lg:p-5 
             bg-[#f8cabb] md:bg-[url('http://res.cloudinary.com/dgcksrb1n/image/upload/v1754593480/w4gd7muiyubkbusexs2z.jpg')] md:bg-cover"
      >
        <div className="w-full px-2 sm:px-3 lg:px-0">
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category, index) => (
                <button
                  className="bg-white rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200 whitespace-nowrap text-sm sm:text-base flex-shrink-0 min-w-fit md:min-w-[150px]"
                  key={index}
                  onClick={() => categoryChange(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Desktop: Flex wrap with justify-between */}
            {/* <div className="hidden lg:flex flex-wrap gap-3 justify-between">
              {categories.map((category, index) => (
                // <Link key={index} href={category.link}>
                <button
                  key={index}
                  className="bg-white rounded-xl px-4 py-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200 min-w-[150px]"
                  onClick={() => categoryChange(category.id)}
                >
                  {category.name}
                </button>
                // </Link>
              ))}
            </div> */}
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:overflow-y-hidden max-h-[360px]">
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px] md:h-[unset]" />
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
              <ProductSkeleton className="w-[160px] sm:w-[unset] flex-shrink-0 h-[270px]" />
            </div>
          ) : (
            <ProductList
              title=""
              data={product}
              locationGroups={locationGroups}
              isBannerProduct={true}
              isSpaceTop={false}
              className="md:min-w-[260px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
