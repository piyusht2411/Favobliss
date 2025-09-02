"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Product } from "@/types";
import { FaStarOfLife } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdRoundedCorner } from "react-icons/md";

interface Props {
  products: Product[];
  title: string;
  subtitle: string;
  offer: string;
}

const BestOfProduct = (props: Props) => {
  const {
    products = [],
    title = "Best of Products",
    subtitle = "Save up to ₹10,000 instantly on eligible products",
    offer = "Benefit with No Cost EMI schemes",
  } = props;
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollStep, setScrollStep] = useState(272);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (price: number, mrp: number) => {
    if (!mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 md:w-4 md:h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const viewAllButton = () => {
    router.push("/brand/apple?page=1");
  };

  const productPage = (path: string) => {
    router.push(`/product/${path}`);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Calculate initial scroll step based on card width
    if (scrollContainerRef.current && !isMobile) {
      const cardElement =
        scrollContainerRef.current.querySelector(".product-card");
      const gap = 16; // space-x-4 = 1rem = 16px
      if (cardElement) {
        setScrollStep(cardElement.clientWidth + gap);
      }
    }

    // Check initial scroll position
    if (!isMobile) {
      checkScrollPosition();
    }

    // Add scroll event listener
    const container = scrollContainerRef.current;
    if (container && !isMobile) {
      container.addEventListener("scroll", checkScrollPosition);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [isMobile]);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container || isMobile) return;

    // Check if we're at the beginning
    setShowLeftArrow(container.scrollLeft > 0);

    // Check if we're at the end
    const isAtEnd =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10;
    setShowRightArrow(!isAtEnd);
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container || isMobile) return;

    const currentScroll = container.scrollLeft;
    let newScroll = currentScroll;

    if (direction === "left") {
      newScroll = Math.max(0, currentScroll - scrollStep);
    } else {
      newScroll = Math.min(container.scrollWidth, currentScroll + scrollStep);
    }

    // Smooth scroll using CSS transitions
    container.style.scrollBehavior = "smooth";
    container.scrollLeft = newScroll;

    // Remove smooth behavior after scroll completes
    setTimeout(() => {
      if (container) container.style.scrollBehavior = "auto";
    }, 500);

    // Update arrow visibility after a short delay
    setTimeout(checkScrollPosition, 510);
  };

  if (!products || products.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  // Show max 8 products
  const displayProducts = products.slice(0, 8);

  return (
    <div className="bg-[#f8f8f8] p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Left Section - Title and Info */}
        <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
              {title}
            </h2>
            <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              {subtitle}
            </p>
          </div>

          {/* Offer Section */}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                <div className="text-red-600 text-sm md:text-lg font-bold">
                  <FaStarOfLife />
                </div>
              </div>
              <span className="text-gray-700 font-medium text-xs md:text-sm ml-1">
                {offer}
              </span>
            </div>
          </div>

          <div className="pt-2 md:pt-4">
            <button
              className="bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-gray-800 transition-colors duration-200 font-medium cursor-pointer text-sm md:text-base"
              onClick={viewAllButton}
            >
              View All
            </button>
          </div>
        </div>

        {/* Right Section - Products */}
        <div className="w-full lg:w-2/3 relative">
          {/* Desktop: Scrollable, Mobile: Grid */}
          {isMobile ? (
            // Mobile Grid Layout
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {displayProducts.map((product) => {
                const variant = product?.variants?.[0];
                const price = variant?.variantPrices?.[0]?.price || 0;
                const mrp = variant?.variantPrices?.[0]?.mrp || 0;
                const discount = calculateDiscount(price, mrp);
                const image =
                  variant?.images?.[0]?.url || "/placeholder-image.jpg";

                return (
                  <div
                    key={product.id}
                    className="w-full"
                    onClick={() => productPage(product.variants[0].slug)}
                  >
                    <div className="bg-gray-100 rounded-xl p-3 hover:shadow-lg transition-shadow duration-200 h-full">
                      {/* Product Image */}
                      <div className="aspect-square mb-3 flex items-center justify-center bg-white rounded-lg">
                        <img
                          src={image}
                          alt={product.variants[0].name}
                          className="w-full h-full object-contain rounded-lg p-2"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900 text-xs leading-tight line-clamp-2 min-h-[2rem]">
                          {product.variants[0].name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          {renderStars(product.averageRating || 0)}
                        </div>

                        {/* Price Section */}
                        <div className="space-y-1">
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-bold text-gray-900">
                              {formatPrice(price)}
                            </span>
                            {mrp > price && (
                              <div className="text-xs text-gray-500">
                                MRP{" "}
                                <span className="line-through">
                                  {formatPrice(mrp)}
                                </span>
                              </div>
                            )}
                            {discount > 0 && (
                              <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded font-medium self-start">
                                {discount}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Desktop Scrollable Layout
            <>
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#CBD5E0 #F7FAFC",
                }}
              >
                <div className="flex space-x-4 min-w-max">
                  {displayProducts.map((product) => {
                    const variant = product?.variants?.[0];
                    const price = variant?.variantPrices?.[0]?.price || 0;
                    const mrp = variant?.variantPrices?.[0]?.mrp || 0;
                    const discount = calculateDiscount(price, mrp);
                    const image =
                      variant?.images?.[0]?.url || "/placeholder-image.jpg";

                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-64 product-card"
                        onClick={() => productPage(product.variants[0].slug)}
                      >
                        <div className="bg-gray-100 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200 h-full">
                          {/* Product Image */}
                          <div className="aspect-square mb-4 flex items-center justify-center bg-white rounded-lg">
                            <img
                              src={image}
                              alt={product.variants[0].name}
                              className="w-full h-full object-contain rounded-lg p-2"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
                              {product.variants[0].name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center space-x-1">
                              {renderStars(product.averageRating || 0)}
                            </div>

                            {/* Price Section */}
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 flex-wrap">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(price)}
                                </span>
                                {mrp > price && (
                                  <div className="text-sm text-gray-500">
                                    MRP{" "}
                                    <span className="line-through">
                                      {formatPrice(mrp)}
                                    </span>
                                  </div>
                                )}
                                {discount > 0 && (
                                  <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded font-medium">
                                    {discount}% off
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scroll Arrows - Only on Desktop */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button
                  onClick={() => scroll("left")}
                  className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all duration-200 border z-10"
                  disabled={!showLeftArrow}
                >
                  <ChevronLeft
                    className={`w-5 h-5 ${
                      showLeftArrow ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all duration-200 border z-10"
                  disabled={!showRightArrow}
                >
                  <ChevronRight
                    className={`w-5 h-5 ${
                      showRightArrow ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestOfProduct;
