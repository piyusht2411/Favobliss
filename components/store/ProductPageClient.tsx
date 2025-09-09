"use client";

import { useEffect, useState, useRef } from "react";
import { Product, LocationGroup, ProductApiResponse, Variant } from "@/types";
import { Gallery } from "@/components/gallery";
import { ProductDetails } from "@/components/store/product-details";
import dynamic from "next/dynamic"; // Added for lazy loading
import { Container } from "@/components/ui/container";
import Breadcrumb from "./Breadcrumbs";
import { MobileStickyActionBar } from "./MobileStickyBar";
import { addToRecentlyViewed } from "@/lib/utils";
import { getLocationGroupById } from "@/actions/get-location-group";
import { ProductTabs } from "./prodcutTabs";

const ProductList = dynamic(
  () =>
    import("@/components/store/product-list").then((mod) => mod.ProductList),
  {
    loading: () => <div>Loading similar products...</div>,
    ssr: false,
  }
);

const ProductReviews = dynamic(
  () =>
    import("@/components/store/product-reviews").then(
      (mod) => mod.ProductReviews
    ),
  {
    loading: () => <div>Loading reviews...</div>,
    ssr: false,
  }
);

interface ProductPageContentProps {
  productData: ProductApiResponse;
  suggestProducts: Product[];
  locationGroups: LocationGroup[];
}

export const ProductPageContent = ({
  productData,
  suggestProducts,
  locationGroups,
}: ProductPageContentProps) => {
  const { variant, product, allVariants } = productData;
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(variant);
  const [locationPrice, setLocationPrice] = useState<{
    price: number;
    mrp: number;
  }>({
    price: variant.variantPrices?.[0]?.price || 0,
    mrp: variant.variantPrices?.[0]?.mrp || 0,
  });
  const [deliveryInfo, setDeliveryInfo] = useState<{
    location: string;
    estimatedDelivery: number;
    isCodAvailable: boolean;
  } | null>(null);
  const [isProductAvailable, setIsProductAvailable] = useState(true);
  const [selectedLocationGroupId, setSelectedLocationGroupId] = useState<
    string | null
  >(null);
  const [locationPinCode, setLocationPinCode] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const handleVariantChange = (variant: Variant) => {
    setCurrentVariant(variant);
    setSelectedVariant(variant);
  };

  const breadcrumbItems = [
    {
      label: product?.category?.name,
      href: `/category/${product?.category?.slug}?page=1`,
    },
    ...(product?.subCategory
      ? [
          {
            label: product?.subCategory?.name,
            href: `/category/${product?.category?.slug}?sub=${product?.subCategory?.slug}&page=1`,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (product?.id) {
      addToRecentlyViewed(product.id);
    }
  }, [product?.id]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (selectedLocationGroupId) {
          const response = await getLocationGroupById(selectedLocationGroupId);
          setLocationPinCode(response.locations[0]?.pincode || null);
        }
      } catch (error) {
        console.error("Failed to fetch location group:", error);
      }
    };
    getData();
  }, [selectedLocationGroupId]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowStickyBar(true);
        return;
      }
    };

    handleResize();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: [0, 0.1],
        rootMargin: "-100px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    } else {
      console.warn("containerRef.current is null");
    }

    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setShowStickyBar(true);
        return;
      }
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isOutOfView = rect.bottom < 0;
        setShowStickyBar(isOutOfView);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-white text-black mb-16">
      <Breadcrumb items={breadcrumbItems} />
      <Container>
        <div className="px-4 py-4 sm:px-6 lg:px-5 pt-0 md:pt-4">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 relative">
            <div className="lg:sticky lg:top-0 lg:overflow-hidden lg:h-auto">
              <Gallery
                images={currentVariant.images}
                product={productData}
                selectedVariant={selectedVariant}
                locationPrice={locationPrice}
                selectedLocationGroupId={selectedLocationGroupId}
                isProductAvailable={isProductAvailable}
                deliveryInfo={deliveryInfo}
                locationPinCode={locationPinCode}
              />
            </div>
            <div className="mt-2 sm:mt-16 lg:mt-0 md:px-24 lg:px-0 flex flex-col gap-y-5">
              <ProductDetails
                productData={productData}
                defaultVariant={variant}
                onVariantChange={handleVariantChange}
                locationGroups={locationGroups}
                totalReviews={totalReviews}
                avgRating={avgRating}
                selectedLocationGroupId={selectedLocationGroupId}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                locationPrice={locationPrice}
                setLocationPrice={setLocationPrice}
                isProductAvailable={isProductAvailable}
                setIsProductAvailable={setIsProductAvailable}
                setSelectedLocationGroupId={setSelectedLocationGroupId}
                deliveryInfo={deliveryInfo}
                setDeliveryInfo={setDeliveryInfo}
                divRef={containerRef}
                reviewsRef={reviewsRef}
              />
            </div>
          </div>
        </div>
        <hr className="md:m-10 md:my-2 mx-10" />
        <div className="flex flex-col gap-y-5 md:gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductTabs productData={productData} productId={product.id} />
          <ProductReviews
            productId={product.id}
            totalReviews={totalReviews}
            avgRating={avgRating}
            setAvgRating={setAvgRating}
            setTotalReviews={setTotalReviews}
            subCategoryId={product?.subCategory?.id || ""}
            reviewsRef={reviewsRef}
          />
          <ProductList
            title="Similar Products"
            data={suggestProducts}
            locationGroups={locationGroups}
          />
          <MobileStickyActionBar
            show={showStickyBar}
            price={locationPrice.price}
            mrp={locationPrice.mrp}
            product={productData}
            selectedVariant={selectedVariant}
            locationPrice={locationPrice}
            selectedLocationGroupId={selectedLocationGroupId}
            isProductAvailable={isProductAvailable}
            deliveryInfo={deliveryInfo}
            locationPinCode={locationPinCode}
          />
        </div>
      </Container>
    </div>
  );
};
