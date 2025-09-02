"use client";

import { CartSelectedItem, Product } from "@/types";
import { X, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDeliveryDate, formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-checkout";
import { useRouter } from "next/navigation";

interface CartItemProps {
  data: Product & {
    checkOutQuantity: number;
    selectedVariant: any;
    price: number;
    mrp: number;
    locationId?: string | null;
  };
  deliveryDays: number;
}

export const CartItem = ({ data, deliveryDays }: CartItemProps) => {
  const { items, removeItem, increaseQuantity, decreaseQuantity } = useCart();
  const { checkOutItems, selectItem, removeSelectedItems, updateItem } =
    useCheckout();
  const [mounted, setMounted] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isChecked = !!checkOutItems.find(
    (item) => item.variantId === data.selectedVariant.id
  );
  const router = useRouter();

  const handleProductAnchor = (path: string) => {
    router.push(`/product/${path}`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectItem = () => {
    const formattedData: CartSelectedItem = {
      id: data.id,
      variantId: data.selectedVariant.id,
      price: data.price,
      mrp: data?.mrp || 0,
      quantity: data.checkOutQuantity,
      image: data.selectedVariant.images[0]?.url || "",
      about: data.selectedVariant.about,
      name: data.selectedVariant.name,
      size: data.selectedVariant.size?.value,
      color: data.selectedVariant.color?.name,
      selectedVariant: data.selectedVariant,
      locationId: data.locationId,
      slug: data.selectedVariant.slug,
    };

    if (isChecked) {
      removeSelectedItems(data.selectedVariant.id);
    } else {
      selectItem(formattedData);
    }
  };

  const onRemoveItem = () => {
    removeSelectedItems(data.selectedVariant.id);
    removeItem(data.selectedVariant.id);
  };

  const discountPercentage = data.mrp
    ? Math.round(((data.mrp - data.price) / data.mrp) * 100)
    : 0;

  if (!mounted) {
    return null;
  }

  return (
    <li className="py-4 px-4 rounded-3xl border bg-[#f6f4f4]">
      <div className="flex items-start">
        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-white mr-4 flex-shrink-0">
          {data.selectedVariant.images[0]?.url ? (
            <Image
              src={data.selectedVariant.images[0].url}
              alt={data.selectedVariant.name}
              fill
              className="object-cover cursor-pointer"
              onClick={() => handleProductAnchor(data.selectedVariant.slug)}
            />
          ) : (
            <div className="bg-gray-200 w-full h-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-sm md:text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 line-clamp-2"
            onClick={() => handleProductAnchor(data.selectedVariant.slug)}
          >
            {data.selectedVariant.name}
          </h3>

          <div className="mt-1 space-y-1 hidden md:block">
            <p className="text-green-600 font-medium text-sm">In Stock</p>
            <p className="text-gray-700 text-sm">Free Shipping</p>
            <p className="text-gray-700 text-sm">
              Standard Delivery by {formatDeliveryDate(deliveryDays)}
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mx-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => decreaseQuantity(data.selectedVariant.id)}
            disabled={data.checkOutQuantity <= 1}
            className="h-8 w-8 p-0 bg-transparent border-0 text-lg"
          >
            -
          </Button>
          <span className="text-sm font-semibold min-w-[20px] text-center">
            {data.checkOutQuantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => increaseQuantity(data.selectedVariant.id)}
            disabled={data.checkOutQuantity >= data.selectedVariant.stock}
            className="h-8 w-8 p-0 bg-transparent border-0 text-lg"
          >
            +
          </Button>
        </div>

        <div className="md:flex flex-col justify-end items-end gap-8 hidden">
          <div className="text-right mx-4 flex gap-2 items-end">
            <div className="text-xs text-gray-500 line-through">
              MRP ₹{data.mrp}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold text-gray-900">
                {formatter.format(data.price)}
              </div>

              <div className="text-xs text-white bg-[#ee8e1d] rounded-full border border-transparent font-normal text-center px-2">
                {discountPercentage}% Off
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveItem}
              className="flex items-center gap-1 text-gray-600 hover:text-red-500 h-8 px-2"
            >
              <X className="h-4 w-4" />
              <span className="text-xs">Remove</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-end items-start gap-1 pt-4 md:hidden">
        <div className="text-right mx-4 flex gap-2 items-end">
          <div className="text-sm font-bold text-gray-900">
            {formatter.format(data.price)}
          </div>
          <div className="text-xs text-gray-500 line-through">
            MRP ₹{data.mrp}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs text-white bg-red-600 rounded-full border border-transparent font-normal text-center px-2">
              {discountPercentage}% Off
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full items-end mr-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveItem}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500 h-8 px-2"
          >
            <X className="h-4 w-4" />
            <span className="text-xs">Remove</span>
          </Button>
        </div>
      </div>
    </li>
  );
};
