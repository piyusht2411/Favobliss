"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Product, Variant } from "@/types";
import { formatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiShoppingBag } from "react-icons/hi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProductFeatures } from "./productFeature";
import BankOffers from "./bankOffer";
import DeliveryInfo from "./delieveryInfo";
import KeyFeatures from "./keyFeatures";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  data: Product;
  defaultVariant: Variant;
  onVariantChange?: (variant: Variant) => void;
}

export const ProductDetails = ({
  data,
  defaultVariant,
  onVariantChange,
}: ProductDetailsProps) => {
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    defaultVariant.sizeId
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    defaultVariant.colorId
  );
  const [showStickyBar, setShowStickyBar] = useState(true);
  const { addItem } = useCart();
  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const uniqueSizes = Array.from(
    new Map(
      data.variants
        .filter((v) => v.size && v.sizeId)
        .map((v) => [v.sizeId, v.size])
    ).entries()
  ).map(([id, size]) => ({ id, size }));

  const uniqueColors = Array.from(
    new Map(
      data.variants
        .filter((v) => v.color && v.colorId)
        .map((v) => [v.colorId, v.color])
    ).entries()
  ).map(([id, color]) => ({ id, color }));

  const availableSizes = uniqueSizes.filter(({ id }) =>
    selectedColor
      ? data.variants.some(
          (v) => v.sizeId === id && v.colorId === selectedColor
        )
      : true
  );

  const availableColors = uniqueColors.filter(({ id }) =>
    selectedSize
      ? data.variants.some((v) => v.colorId === id && v.sizeId === selectedSize)
      : true
  );

  // Handle sticky bar visibility - always show on mobile but hide when footer is visible
  useEffect(() => {
    const handleScroll = () => {
      // Check for footer visibility
      const footer = document.querySelector("footer");
      const footerRect = footer?.getBoundingClientRect();
      const isFooterVisible = footerRect && footerRect.top < window.innerHeight;

      // If footer is visible, hide sticky bar
      if (isFooterVisible) {
        setShowStickyBar(false);
        return;
      }

      // Check if mobile
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowStickyBar(true);
        return;
      }

      if (buttonsRef.current && containerRef.current) {
        const buttonsRect = buttonsRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Show sticky bar when original buttons are out of view or when scrolling past the container
        const shouldShow =
          buttonsRect.bottom < window.innerHeight * 0.8 ||
          containerRect.bottom < window.innerHeight;
        setShowStickyBar(!shouldShow);
      }
    };

    // Set initial state
    handleScroll();

    // Listen to window scroll for footer detection
    window.addEventListener("scroll", handleScroll);

    const container = containerRef.current?.closest(".overflow-y-scroll");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const variant = data.variants.find(
      (v) => v.sizeId === selectedSize && v.colorId === selectedColor
    );

    if (variant) {
      setSelectedVariant(variant);
      onVariantChange?.(variant);
    }
  }, [selectedSize, selectedColor, data.variants, onVariantChange]);

  const handleSizeChange = useCallback(
    (sizeId: string) => {
      setSelectedSize(sizeId);

      if (
        selectedColor &&
        !data.variants.some(
          (v) => v.sizeId === sizeId && v.colorId === selectedColor
        )
      ) {
        const availableColorForSize = data.variants.find(
          (v) => v.sizeId === sizeId
        )?.colorId;
        setSelectedColor(availableColorForSize);
      }
    },
    [selectedColor, data.variants]
  );

  const handleColorChange = useCallback(
    (colorId: string) => {
      setSelectedColor(colorId);

      if (
        selectedSize &&
        !data.variants.some(
          (v) => v.colorId === colorId && v.sizeId === selectedSize
        )
      ) {
        const availableSizeForColor = data.variants.find(
          (v) => v.colorId === colorId
        )?.sizeId;
        setSelectedSize(availableSizeForColor);
      }
    },
    [selectedSize, data.variants]
  );

  const onHandleCart = useCallback(() => {
    try {
      addItem({
        ...data,
        price: selectedVariant.price,
        selectedVariant,
        checkOutQuantity: 1,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [addItem, data, selectedVariant]);

  const onHandleBuyNow = useCallback(() => {
    try {
      addItem({
        ...data,
        price: selectedVariant.price,
        selectedVariant,
        checkOutQuantity: 1,
      });
      router.push("/checkout/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [addItem, data, selectedVariant, router]);

  // Calculate discount percentage if MRP exists
  const discountPercentage = selectedVariant.mrp
    ? Math.round(
        ((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) *
          100
      )
    : 0;

  const ActionButtons = ({
    className = "",
    isSticky = false,
  }: {
    className?: string;
    isSticky?: boolean;
  }) => (
    <div className={cn("grid grid-cols-2 gap-x-4", className)}>
      <Button
        className="h-14 font-bold bg-black hover:bg-gray-800 text-white"
        onClick={onHandleCart}
        disabled={selectedVariant.stock <= 0}
      >
        <HiShoppingBag className="mr-2 h-5 w-5" />
        ADD TO BAG
      </Button>
      <Button
        variant="outline"
        className="h-14 font-bold border-black text-black hover:bg-gray-50"
        onClick={onHandleBuyNow}
        disabled={selectedVariant.stock <= 0}
      >
        Buy Now
      </Button>
    </div>
  );

  return (
    <>
      <div ref={containerRef} className="text-black bg-white">
        <div className="container mx-auto px-4 py-6 pb-3 md:py-6">
          {/* Brand Name */}
          {data.brand && (
            <p className="text-sm text-gray-600 mb-1 font-medium">
              {data.brand}
            </p>
          )}

          <h1 className="text-2xl md:text-xl font-bold">{data.name}</h1>
          <p className="text-[#088466] mt-2">
            4.1 ⭐ <span className="underline">(9 ratings & 4 Reviews)</span>
          </p>
          {/* <button className="my-4 w-[159.88px] h-[32px] bg-[#CFFFF3] rounded-[82px] font-bold font-inter text-[11.25px]">
            <p className="text-[#088466]">Rs 3750 Bank Discount</p>
          </button> */}

          <div className="py-2 rounded-md max-w-md">
            <div className="flex items-center justify-between flex-wrap gap-3 md:gap-0">
              {/* <div>
                <p className="text-3xl font-semibold">
                  {formatter.format(selectedVariant.price)}
                </p>
                <p className="text-sm text-gray-500">(Incl. of all taxes)</p>
              </div> */}
              {/* <div className="flex items-center gap-8 md:gap-14">
      <div className="border border-black px-3 py-1 rounded">OR</div>
      <div>
        <p className="text-xl font-semibold">
          ₹{(selectedVariant.price / 12).toFixed(0)}/mo<sup>*</sup>
        </p>
        <a href="#" className="text-green-600 text-sm underline">
          EMI Options
        </a>
      </div>
    </div> */}
            </div>

            {/* Updated MRP and discount section */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              {selectedVariant.mrp && (
                <>
                  <span className="text-3xl font-semibold">
                    ₹{selectedVariant.price}
                  </span>
                  <span className="text-gray-500 text-base mr-2">
                    MRP{" "}
                    <span className="line-through">
                      {" "}
                      ₹{selectedVariant.mrp}
                    </span>
                  </span>
                  <span className="bg-orange-400 text-white text-sm font-bold rounded-full px-2 py-1">
                    {discountPercentage}% off
                  </span>
                  <span className="text-base text-gray-500">
                    (Incl. of all taxes)
                  </span>
                </>
              )}
            </div>

            {/* Low Cost EMI section */}
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-medium">
                Low Cost EMI starting from ₹
                {(selectedVariant.price / 24).toFixed(0)}/mo*
              </span>
            </div>
          </div>

          {selectedVariant.stock <= 0 && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>Out of stock</AlertDescription>
            </Alert>
          )}
          {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
            <Alert variant="default" className="mt-2">
              <AlertDescription>
                Only {selectedVariant.stock} left in stock!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-y-6 mt-4">
            {availableColors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* <h4 className="font-semibold text-black text-base">
                    Color:{" "}
                    {selectedColor
                      ? availableColors.find((c) => c.id === selectedColor)
                          ?.color?.name ?? "Unknown"
                      : "Select Color"}
                  </h4> */}
                  <span className="text-sm text-gray-500">
                    {availableColors.length} available
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map(({ id, color }) => {
                    const isSelected = selectedColor === id;
                    const isAvailable = selectedSize
                      ? data.variants.some(
                          (v) =>
                            v.colorId === id &&
                            v.sizeId === selectedSize &&
                            v.stock > 0
                        )
                      : data.variants.some(
                          (v) => v.colorId === id && v.stock > 0
                        );

                    const variantWithColor = data.variants.find(
                      (v) => v.colorId === id
                    );
                    const previewImage = variantWithColor?.images?.[0]?.url;

                    return (
                      <div
                        key={id}
                        className={cn(
                          "relative group cursor-pointer transition-all duration-200",
                          !isAvailable && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() =>
                          isAvailable && id && handleColorChange(id)
                        }
                      >
                        <div
                          className={cn(
                            "w-16 h-16 rounded-lg border-2 transition-all duration-200 overflow-hidden",
                            isSelected
                              ? "border-black shadow-lg ring-2 ring-black ring-offset-2"
                              : "border-gray-200 hover:border-gray-400",
                            !isAvailable && "grayscale"
                          )}
                        >
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt={color?.name || "Color Preview"}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundColor: color?.value || "#f3f4f6",
                              }}
                            />
                          )}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {color?.name ?? "Unknown"}
                          </div>
                        </div>
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-0.5 bg-red-500 rotate-45 absolute" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* <h4 className="font-semibold text-black text-base">
                    Size:{" "}
                    {selectedSize
                      ? availableSizes.find((s) => s.id === selectedSize)?.size
                          ?.value
                      : "Select Size"}
                  </h4> */}
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map(({ id, size }) => {
                    const isSelected = selectedSize === id;
                    const isAvailable = selectedColor
                      ? data.variants.some(
                          (v) =>
                            v.sizeId === id &&
                            v.colorId === selectedColor &&
                            v.stock > 0
                        )
                      : data.variants.some(
                          (v) => v.sizeId === id && v.stock > 0
                        );

                    return (
                      <button
                        key={id}
                        onClick={() =>
                          isAvailable && id && handleSizeChange(id)
                        }
                        disabled={!isAvailable}
                        className={cn(
                          "px-4 py-3 min-w-[3rem] text-sm font-medium rounded-lg border-2 transition-all duration-200",
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-900 hover:border-gray-400",
                          !isAvailable &&
                            "opacity-50 cursor-not-allowed line-through"
                        )}
                      >
                        {size?.value || "Unknown"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <ProductFeatures data={data} />
          {data.expressDelivery && (
            <p className="font-bold text-orange-500 text-2xl pt-6">
              Express Delivery | Delhi Ncr Only | Call Now +91-9540717161
            </p>
          )}
          <div className="mt-6 space-y-4">
            <div>
              <BankOffers />
            </div>
            <div className="max-w-4xl mx-auto py-4 mt-5">
              <DeliveryInfo />
              <KeyFeatures />
            </div>
          </div>

          <div ref={buttonsRef} className="mt-8 max-w-sm md:block hidden">
            <ActionButtons />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {/* <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out",
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                {selectedVariant.images?.[0]?.url && (
                  <Image
                    src={selectedVariant.images[0].url}
                    alt={data.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm truncate">{data.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">
                    {formatter.format(selectedVariant.price)}
                  </span>
                  {selectedVariant.mrp && (
                    <span className="line-through text-gray-500 text-xs">
                      ₹{selectedVariant.mrp}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <ActionButtons className="w-full md:w-80" isSticky={true} />
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
