"use client";

import { Button } from "@/components/ui/button";
import { HiShoppingBag } from "react-icons/hi";
import { formatter } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Product, Variant } from "@/types";
import { ActionButtons } from "./ActionButton";

interface MobileStickyActionBarProps {
  price: number;
  mrp?: number;
  show: boolean;
  product: Product;
  selectedVariant: Variant;
  locationPrice: { price: number; mrp: number };
  selectedLocationId: string | null;
  isProductAvailable: boolean;
  deliveryInfo: {
    location: string;
    estimatedDelivery: number;
  } | null;
}

export const MobileStickyActionBar = ({
  price,
  mrp,
  product,
  selectedLocationId,
  selectedVariant,
  isProductAvailable,
  locationPrice,
  show,
  deliveryInfo,
}: MobileStickyActionBarProps) => {
  const discountPercentage = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Price section */}
        {/* <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatter.format(price)}</span>
            {mrp && mrp > price && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatter.format(mrp)}
                </span>
                <span className="bg-orange-400 text-white text-xs font-bold rounded px-1.5 py-0.5">
                  {discountPercentage}% off
                </span>
              </>
            )}
          </div>
          <span className="text-xs text-gray-500">
            EMI from ₹{(price / 24).toFixed(0)}/mo*
          </span>
        </div> */}

        {/* Action buttons */}
        <ActionButtons
          product={product}
          selectedVariant={selectedVariant}
          locationPrice={locationPrice}
          selectedLocationId={selectedLocationId}
          isProductAvailable={isProductAvailable}
          className="w-full"
          deliveryInfo={deliveryInfo}
        />

        {/* <div className="flex gap-2 flex-1 max-w-[200px]">
          <Button
            className="flex-1 h-10 bg-black hover:bg-gray-800 text-white text-sm font-medium"
            onClick={onAddToCart}
            disabled={isDisabled}
          >
            <HiShoppingBag className="mr-1 h-4 w-4" />
            Add
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-10 border-black text-black hover:bg-gray-50 text-sm font-medium"
            onClick={onBuyNow}
            disabled={isDisabled}
          >
            Buy Now
          </Button>
        </div> */}
      </div>
    </div>
  );
};
