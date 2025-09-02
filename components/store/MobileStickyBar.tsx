"use client";

import { cn, formatter } from "@/lib/utils";
import { Product, ProductApiResponse, Variant } from "@/types";
import { ActionButtons } from "./ActionButton";

interface MobileStickyActionBarProps {
  price: number;
  mrp?: number;
  show: boolean;
  product: ProductApiResponse;
  selectedVariant: Variant;
  locationPrice: { price: number; mrp: number };
  selectedLocationGroupId: string | null;
  isProductAvailable: boolean;
  locationPinCode: string | null;
  deliveryInfo: {
    location: string;
    estimatedDelivery: number;
    isCodAvailable: boolean;
  } | null;
}

export const MobileStickyActionBar = ({
  price,
  mrp,
  product,
  selectedLocationGroupId,
  selectedVariant,
  isProductAvailable,
  locationPrice,
  show,
  deliveryInfo,
  locationPinCode,
}: MobileStickyActionBarProps) => {
  const discountPercentage = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Mobile Layout - unchanged */}
      <div className="flex items-center justify-between gap-4 md:hidden">
        <ActionButtons
          productData={product}
          selectedVariant={selectedVariant}
          locationPrice={locationPrice}
          selectedLocationGroupId={selectedLocationGroupId}
          isProductAvailable={isProductAvailable}
          className="w-full"
          deliveryInfo={deliveryInfo}
          locationPinCode={locationPinCode}
        />
      </div>

      <div className="hidden md:flex items-center justify-between gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-black">
              {formatter.format(price)}
            </span>
            {mrp && mrp > price && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  MRP {formatter.format(mrp)}
                </span>
                <span className="text-sm font-medium text-white bg-orange-400 px-2 py-1 rounded-full">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
          {deliveryInfo && (
            <div className="text-sm text-gray-600 mt-1">
              Delivery to {deliveryInfo.location} in{" "}
              {deliveryInfo.estimatedDelivery} days
            </div>
          )}
        </div>

        {/* Action buttons on right */}
        <ActionButtons
          productData={product}
          selectedVariant={selectedVariant}
          locationPrice={locationPrice}
          selectedLocationGroupId={selectedLocationGroupId}
          isProductAvailable={isProductAvailable}
          className="flex-shrink-0"
          deliveryInfo={deliveryInfo}
          locationPinCode={locationPinCode}
        />
      </div>
    </div>
  );
};
