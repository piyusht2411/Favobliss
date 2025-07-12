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

  const onVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
  };

  const selectedVariant =
    data.variants[selectedVariantIndex] || data.variants[0];
  const imageUrl = selectedVariant?.images[0]?.url || "/placeholder-image.jpg";
  const priceDisplay = formatter.format(locationPrice.price); // Use location-based price
  const mrpDisplay = locationPrice.mrp
    ? formatter.format(locationPrice.mrp)
    : null;

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
    <div
      onClick={onClick}
      className="group md:cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-white rounded-lg overflow-hidden border border-gray-100"
    >
      <div className="relative">
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={data.name}
            fill
            className="object-contain hover:scale-105 transition duration-300 p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Stock status badge */}
          {/* {selectedVariant &&
            selectedVariant.stock <= 5 &&
            selectedVariant.stock > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Only {selectedVariant.stock} left
              </div>
            )} */}

          {selectedVariant && selectedVariant.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>

        {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute w-full px-6 bottom-5">
          <div className="gap-x-6 justify-center hidden md:flex">
            <IconButton
              onClick={onPreview}
              icon={<ExpandIcon size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onHandleCart}
              icon={<ShoppingCart size={20} className="text-pink-600" />}
              disabled={!selectedVariant || selectedVariant.stock <= 0}
            />
          </div>
        </div> */}
      </div>

      <div className="w-full flex flex-col space-y-3 p-4">
        <h3 className="text-black font-bold text-sm leading-5 h-10 overflow-hidden">
          <span className="line-clamp-2">{data.name}</span>
        </h3>

        <p className="w-full text-sm text-zinc-600 line-clamp-1">
          {data.about}
        </p>

        {/* Brand */}
        {/* {data.brand && (
          <p className="text-xs text-zinc-500 font-medium">{data.brand}</p>
        )} */}

        {/* Price Display */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-zinc-900">{priceDisplay}</p>
          {mrpDisplay && mrpDisplay !== priceDisplay && (
            <p className="text-sm text-zinc-500 line-through">{mrpDisplay}</p>
          )}
        </div>

        {/* Variant Options */}
        {data.variants.length > 0 && (
          <div className="space-y-2">
            {/* Color Variants */}
            {uniqueColors.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 flex-wrap">
                  {uniqueColors.map((color, index) => {
                    if (!color) return null;
                    const variantIndex = data.variants.findIndex(
                      (v) => v.color && color && v.color.id === color.id
                    );
                    const isSelected = selectedVariantIndex === variantIndex;
                    return (
                      <button
                        key={color.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVariantChange(variantIndex);
                        }}
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-zinc-800 scale-110"
                            : "border-zinc-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Add to Cart for Mobile */}
        {/* <div className="md:hidden">
          <button
            onClick={onHandleCart}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-pink-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {selectedVariant && selectedVariant.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div> */}
      </div>
    </div>
  );
};
