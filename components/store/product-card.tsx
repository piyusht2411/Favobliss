"use client";
import { Product } from "@/types";
import Image from "next/image";
import { IconButton } from "@/components/ui/icon-button";
import { ExpandIcon, ShoppingCart } from "lucide-react";
import { formatter } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";
import { usePreviewModal } from "@/hooks/use-preview-modal";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  data: Product;
}

export const ProductCard = ({ data }: ProductCardProps) => {
  const router = useRouter();
  const { onOpen } = usePreviewModal();
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

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
        selectedVariant: {
          id: selectedVariant.id,
          price: selectedVariant.price,
          stock: selectedVariant.stock,
          sku: selectedVariant.sku,
          size: selectedVariant.size,
          color: selectedVariant.color,
          images: selectedVariant.images,
        },
        checkOutQuantity: 1,
      });
    }
  };

  const onVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
  };

  const selectedVariant =
    data.variants[selectedVariantIndex] || data.variants[0];
  const imageUrl = selectedVariant?.images[0]?.url || "/placeholder-image.jpg";
  const priceDisplay = selectedVariant
    ? formatter.format(selectedVariant.price)
    : "Price unavailable";
  const mrpDisplay = selectedVariant?.mrp
    ? formatter.format(selectedVariant.mrp)
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
    if (
      !acc.find((size) => size && variant.size && size.id === variant.size.id)
    ) {
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
          {selectedVariant &&
            selectedVariant.stock <= 5 &&
            selectedVariant.stock > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Only {selectedVariant.stock} left
              </div>
            )}

          {selectedVariant && selectedVariant.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute w-full px-6 bottom-5">
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
        </div>
      </div>

      <div className="w-full flex flex-col space-y-3 p-4">
        <h3 className="text-black font-bold text-sm leading-5 h-10 overflow-hidden">
          <span className="line-clamp-2">{data.name}</span>
        </h3>

        <p className="w-full text-sm text-zinc-600 line-clamp-1">
          {data.about}
        </p>

        {/* Brand */}
        {data.brand && (
          <p className="text-xs text-zinc-500 font-medium">{data.brand}</p>
        )}

        {/* Price Display */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-zinc-900">{priceDisplay}</p>
          {mrpDisplay && mrpDisplay !== priceDisplay && (
            <p className="text-sm text-zinc-500 line-through">{mrpDisplay}</p>
          )}
          {/* {mrpDisplay && mrpDisplay !== priceDisplay && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              {Math.round(
                (((selectedVariant.mrp ?? 0) - (selectedVariant.price ?? 0)) /
                  (selectedVariant.mrp ?? 1)) *
                  100
              )}
              % OFF
            </span>
          )} */}
        </div>

        {/* Variant Options */}
        {data.variants.length > 0 && (
          <div className="space-y-2">
            {/* Color Variants */}
            {uniqueColors.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-600 font-medium">
                  Colors:
                </span>
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

            {/* Size Variants */}
            {uniqueSizes.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-600 font-medium">
                  Sizes:
                </span>
                <div className="flex gap-1 flex-wrap">
                  {uniqueSizes.map((size) => {
                    if (!size) return null;
                    const variantIndex = data.variants.findIndex(
                      (v) =>
                        v.size && v.size.id && size && v.size.id === size.id
                    );
                    const isSelected = selectedVariantIndex === variantIndex;
                    return (
                      <button
                        key={size.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVariantChange(variantIndex);
                        }}
                        className={`px-2 py-1 text-xs rounded border transition-all duration-200 ${
                          isSelected
                            ? "border-zinc-800 bg-zinc-800 text-white"
                            : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
                        }`}
                      >
                        {size.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Add to Cart for Mobile */}
        <div className="md:hidden">
          <button
            onClick={onHandleCart}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-pink-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {selectedVariant && selectedVariant.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};
