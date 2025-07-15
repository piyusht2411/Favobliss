"use client";

import React, { useState } from "react";
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
        className={`w-4 h-4 ${
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

  if (!products || products.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-500">No products available</p>
        </div>
      </div>
    );
  }

  // Show max 10 products
  const displayProducts = products.slice(0, 8);

  return (
    <div className="bg-white p-6">
      <div className="flex gap-8">
        {/* Left Section - Title and Info */}
        <div className="w-1/3 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {subtitle}
            </p>
          </div>

          {/* Offer Section */}
          <div
            className="border-t border-gray-200 pt-2"
            style={{ marginTop: "10px" }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center">
                <div className="text-red-600 text-lg font-bold">
                  <FaStarOfLife />
                </div>
              </div>
              <span className="text-gray-700 font-medium text-sm ml-1">
                {offer}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors duration-200 font-medium cursor-pointer"
              onClick={viewAllButton}
            >
              View All
            </button>
          </div>
        </div>

        {/* Right Section - Scrollable Products */}
        <div className="w-2/3 relative">
          {/* Scroll Container */}
          <div
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
                    className="flex-shrink-0 w-64"
                    onClick={() => productPage(product.slug)}
                  >
                    <div className="bg-gray-100 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200 h-full">
                      {/* Product Image */}
                      <div className="aspect-square mb-4 flex items-center justify-center bg-white rounded-lg">
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-contain rounded-lg p-2"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
                          {product.name}
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

          {/* Scroll Arrows */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              onClick={() => {
                const container = document.querySelector(".overflow-x-auto");
                if (container) {
                  container.scrollLeft -= 272; // Width of card + gap
                }
              }}
              className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 border"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => {
                const container = document.querySelector(".overflow-x-auto");
                if (container) {
                  container.scrollLeft += 272; // Width of card + gap
                }
              }}
              className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 border"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestOfProduct;
