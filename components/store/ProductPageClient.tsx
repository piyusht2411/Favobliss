"use client";

import { useEffect, useState } from "react";
import { Product, Variant, Location } from "@/types";
import { Gallery } from "@/components/gallery";
import { ProductDetails } from "@/components/store/product-details";
import { ProductList } from "@/components/store/product-list";
import { Container } from "@/components/ui/container";
import { ProductReviews } from "@/components/store/product-reviews";
import { ProductTabs } from "@/components/store/prodcutTabs";
import Breadcrumb from "./Breadcrumbs";
import { ActionButtons } from "./ActionButton";
import { MobileStickyActionBar } from "./MobileStickyBar";
import { getLocationById } from "@/actions/get-locations";
import { addToRecentlyViewed } from "@/lib/utils";

interface ProductPageContentProps {
  product: Product;
  suggestProducts: Product[];
  locations: Location[];
}

export const ProductPageContent = ({
  product,
  suggestProducts,
  locations,
}: ProductPageContentProps) => {
  const [currentVariant, setCurrentVariant] = useState(product.variants[0]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [locationPrice, setLocationPrice] = useState<{
    price: number;
    mrp: number;
  }>({
    price: product.variants[0].price,
    mrp: product.variants[0].mrp || product.variants[0].price,
  });
  const [deliveryInfo, setDeliveryInfo] = useState<{
    location: string;
    estimatedDelivery: number;
  } | null>(null);
  const [isProductAvailable, setIsProductAvailable] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  const [locationPinCode, setLocationPinCode] = useState<string | null>(null);

  const handleVariantChange = (variant: Variant) => {
    setCurrentVariant(variant);
  };

  const breadcrumbItems = [
    {
      label: product.category.name,
      href: `/category/${product?.category?.slug}?page=1`,
    },
  ];

  useEffect(() => {
    if (product?.id) {
      addToRecentlyViewed(product.id);
    }
  }, [product?.id]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (selectedLocationId) {
          const response = await getLocationById(selectedLocationId);
          setLocationPinCode(response.pincode);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    getData();
  }, [selectedLocationId]);

  return (
    <div className="bg-white text-black mb-16">
      <Breadcrumb items={breadcrumbItems} />
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-5">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 relative">
            <div className="lg:sticky lg:top-0 lg:overflow-hidden lg:h-auto">
              <Gallery
                images={currentVariant.images}
                product={product}
                selectedVariant={selectedVariant}
                locationPrice={locationPrice}
                selectedLocationId={selectedLocationId}
                isProductAvailable={isProductAvailable}
                deliveryInfo={deliveryInfo}
                locationPinCode={locationPinCode}
              />
            </div>
            <div className="mt-10 sm:mt-16 lg:mt-0 md:px-24 lg:px-0 flex flex-col gap-y-5">
              <ProductDetails
                data={product}
                defaultVariant={product.variants[0]}
                onVariantChange={handleVariantChange}
                locations={locations}
                totalReviews={totalReviews}
                avgRating={avgRating}
                selectedLocationId={selectedLocationId}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                locationPrice={locationPrice}
                setLocationPrice={setLocationPrice}
                isProductAvailable={isProductAvailable}
                setIsProductAvailable={setIsProductAvailable}
                setSelectedLocationId={setSelectedLocationId}
                deliveryInfo={deliveryInfo}
                setDeliveryInfo={setDeliveryInfo}
              />
            </div>
          </div>
        </div>
        <hr className="md:m-10 md:my-2 mx-10" />
        <div className="flex flex-col gap-y-5 md:gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductTabs product={product} productId={product.id} />
          <ProductReviews
            productId={product.id}
            totalReviews={totalReviews}
            avgRating={avgRating}
            setAvgRating={setAvgRating}
            setTotalReviews={setTotalReviews}
            subCategoryId={product?.subCategory?.id || ""}
          />
          <ProductList
            title="Similar Products"
            data={suggestProducts}
            locations={locations}
          />
          <MobileStickyActionBar
            show={true}
            price={locationPrice.price}
            mrp={locationPrice.mrp}
            product={product}
            selectedVariant={selectedVariant}
            locationPrice={locationPrice}
            selectedLocationId={selectedLocationId}
            isProductAvailable={isProductAvailable}
            deliveryInfo={deliveryInfo}
            locationPinCode={locationPinCode}
          />
        </div>
      </Container>
    </div>
  );
};
