"use client";

import { useState } from "react";
import { Product, Variant, Location } from "@/types";
import { Gallery } from "@/components/gallery";
import { ProductDetails } from "@/components/store/product-details";
import { ProductList } from "@/components/store/product-list";
import { Container } from "@/components/ui/container";
import { ProductReviews } from "@/components/store/product-reviews";
import { ProductTabs } from "@/components/store/prodcutTabs";
import Breadcrumb from "./Breadcrumbs";

interface ProductPageContentProps {
  product: Product;
  suggestProducts: Product[];
  locations: Location[]; // Add locations
}

export const ProductPageContent = ({
  product,
  suggestProducts,
  locations, // Receive locations
}: ProductPageContentProps) => {
  const [currentVariant, setCurrentVariant] = useState(product.variants[0]);

  const handleVariantChange = (variant: Variant) => {
    setCurrentVariant(variant);
  };

  const breadcrumbItems = [
    {
      label: product.category.name,
      href: `/category/${product?.category?.slug}?page=1`,
    },
    {
      label: product.name,
      href: `/product/${product?.slug}`,
    },
  ];

  return (
    <div className="bg-white text-black mb-16">
      <Breadcrumb items={breadcrumbItems} />
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-5">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <div>
              <Gallery images={currentVariant.images} />
            </div>
            <div className="mt-10 sm:mt-16 lg:mt-0 md:px-24 lg:px-0 flex flex-col gap-y-5">
              <ProductDetails
                data={product}
                defaultVariant={product.variants[0]}
                onVariantChange={handleVariantChange}
                locations={locations} // Pass locations
              />
              {/* <ProductReviews productId={product.id} /> */}
            </div>
          </div>
        </div>
        <hr className="md:m-10 md:my-2 mx-10" />
        <div className="flex flex-col gap-y-5 md:gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductTabs product={product} productId={product.id} />
          <ProductList
            title="Similar Products"
            data={suggestProducts}
            locations={locations}
          />
        </div>
      </Container>
    </div>
  );
};
