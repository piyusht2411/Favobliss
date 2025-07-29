"use client";

import { Product, Location } from "@/types";
import Image from "next/image";
import { IconButton } from "@/components/ui/icon-button";
import { ExpandIcon, ShoppingCart } from "lucide-react";
import { formatter } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState, useEffect } from "react";
import { usePreviewModal } from "@/hooks/use-preview-modal";
import { useCart } from "@/hooks/use-cart";
import { Star } from "lucide-react";

interface ProductCardProps {
  data: Product;
  locations: Location[]; // Add locations
}

export const ProductCard = ({ data, locations }: ProductCardProps) => {
  const router = useRouter();
  const { onOpen } = usePreviewModal();
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [locationPrice, setLocationPrice] = useState<{
    price: number;
    mrp: number;
  }>({
    price: data.variants[0]?.price || 0,
    mrp: data.variants[0]?.mrp || data.variants[0]?.price || 0,
  });
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  // Calculate location-based price
  useEffect(() => {
    const defaultPincode = "110040"; // New Delhi
    let locationData: { pincode: string } | null = null;
    try {
      const storedData = localStorage.getItem("locationData");
      if (storedData) {
        locationData = JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Error parsing locationData from localStorage:", error);
    }

    const inputPincode = locationData?.pincode || defaultPincode;
    const location = locations.find((loc) => loc.pincode === inputPincode);
    const selectedVariant =
      data.variants[selectedVariantIndex] || data.variants[0];

    if (location && selectedVariant?.variantPrices) {
      const variantPrice = selectedVariant.variantPrices.find(
        (vp) => vp.locationId === location.id
      );
      if (variantPrice) {
        setSelectedLocationId(location.id);
        setLocationPrice({ price: variantPrice.price, mrp: variantPrice.mrp });
        return;
      }
    }

    // Fallback to New Delhi or default variant price
    const defaultLocation = locations.find(
      (loc) => loc.pincode === defaultPincode
    );
    const defaultVariantPrice = defaultLocation
      ? selectedVariant?.variantPrices?.find(
          (vp) => vp.locationId === defaultLocation.id
        )
      : null;
    setSelectedLocationId(defaultLocation?.id || null);
    setLocationPrice({
      price: defaultVariantPrice?.price || selectedVariant?.price || 0,
      mrp:
        defaultVariantPrice?.mrp ||
        selectedVariant?.mrp ||
        selectedVariant?.price ||
        0,
    });
  }, [selectedVariantIndex, locations, data.variants]);

  const onClick = () => {
    router.push(`/product/${data?.slug}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onOpen(data);
  };

  const onHandleCart: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    if (data.variants.length > 0) {
      const selectedVariant = data.variants[selectedVariantIndex];
      addItem({
        ...data,
        price: locationPrice.price, // Use location-based price
        selectedVariant: {
          id: selectedVariant.id,
          price: locationPrice.price, // Use location-based price
          stock: selectedVariant.stock,
          sku: selectedVariant.sku,
          size: selectedVariant.size,
          color: selectedVariant.color,
          images: selectedVariant.images,
        },
        checkOutQuantity: 1,
        // locationId: selectedLocationId, // Include locationId
        pincode: "247001",
      });
    }
  };

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

  const onVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
  };

  const selectedVariant =
    data.variants[selectedVariantIndex] || data.variants[0];
  const imageUrl = selectedVariant?.images[0]?.url || "/placeholder-image.jpg";
  const discount = calculateDiscount(locationPrice.price, locationPrice.mrp);

  // Get unique colors for variant display
  const uniqueColors = data.variants.reduce((acc, variant) => {
    if (
      !acc.find(
        (color) => color && variant.color && color.id === variant.color.id
      )
    ) {
      acc.push(variant.color);
    }
    return acc;
  }, [] as (typeof data.variants)[0]["color"][]);

  // Get unique sizes for variant display
  const uniqueSizes = data.variants.reduce((acc, variant) => {
    if (!acc.find((size) => size && variant.size && size.id === size.id)) {
      acc.push(variant.size);
    }
    return acc;
  }, [] as (typeof data.variants)[0]["size"][]);

  return (
    <div onClick={onClick} className="w-full cursor-pointer">
      <div className="bg-gray-100 rounded-xl p-3 md:p-4 hover:shadow-lg transition-shadow duration-200 h-full">
        {/* Product Image */}
        <div className="aspect-square mb-3 md:mb-4 flex items-center justify-center bg-white rounded-lg relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={data.name}
            fill
            className="object-contain rounded-lg p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Stock status badge */}
          {selectedVariant && selectedVariant.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 text-xs md:text-sm leading-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
            {data.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {renderStars(data.averageRating || 0)}
          </div>

          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2 flex-wrap">
              <span className="text-sm md:text-lg font-bold text-gray-900">
                {formatPrice(locationPrice.price)}
              </span>
              {locationPrice.mrp > locationPrice.price && (
                <div className="text-xs md:text-sm text-gray-500">
                  MRP{" "}
                  <span className="line-through">
                    {formatPrice(locationPrice.mrp)}
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
};
