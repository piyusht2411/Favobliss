"use client";
import { Location, Product } from "@/types";
import React from "react";
import { ProductList } from "./product-list";
import Link from "next/link";

interface Props {
  data: Product[];
  locations: Location[];
}

const PromotionalBanner = (props: Props) => {
  const { data, locations } = props;

  const categories = [
    { name: "AC", link: "/category/air-conditioners?page=1" },
    {
      name: "Refrigerators",
      link: "/category/home-appliances?sub=refrigerators?page=1",
    },
    { name: "Washing Machines", link: "/category/washing-machine?page=1" },
    {
      name: "Air Coolers",
      link: "/category/home-appliances?sub=air-coolers?page=1",
    },
    { name: "Television", link: "/category/television?page=1" },
    {
      name: "Microwave",
      link: "/category/kitchen-appliances?sub=microwave-ovens?page=1",
    },
    {
      name: "Vacuum cleaner",
      link: "/category/home-appliances?sub=vacuum-cleaners?page=1",
    },
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      <div
        className="relative rounded-none sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-cover bg-center bg-no-repeat flex items-end 
                   min-h-[60vh] sm:min-h-[80vh] lg:min-h-[120vh] 
                   p-3 sm:p-4 lg:p-5"
        style={{
          backgroundImage:
            "url('http://res.cloudinary.com/dgcksrb1n/image/upload/v1754593480/w4gd7muiyubkbusexs2z.jpg')",
        }}
      >
        <div className="w-full px-2 sm:px-3 lg:px-4">
          <div className="mb-4 sm:mb-6">
            <div className="flex lg:hidden gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category, index) => (
                <Link key={index} href={category.link}>
                  <button className="bg-white rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200 whitespace-nowrap text-sm sm:text-base flex-shrink-0">
                    {category.name}
                  </button>
                </Link>
              ))}
            </div>

            {/* Desktop: Flex wrap with justify-between */}
            <div className="hidden lg:flex flex-wrap gap-3 justify-between">
              {categories.map((category, index) => (
                <Link key={index} href={category.link}>
                  <button className="bg-white rounded-xl px-4 py-2 text-gray-800 font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200 min-w-[150px]">
                    {category.name}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          <ProductList
            title=""
            data={data}
            locations={locations}
            isBannerProduct={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
