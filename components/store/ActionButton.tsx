"use client";

import { Button } from "@/components/ui/button";
import { HiShoppingBag } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { Product, ProductApiResponse, Variant } from "@/types";
import { IoBagHandle } from "react-icons/io5";

interface ActionButtonsProps {
  className?: string;
  isSticky?: boolean;
  productData: ProductApiResponse;
  selectedVariant: Variant;
  locationPrice: { price: number; mrp: number };
  selectedLocationGroupId: string | null;
  isProductAvailable: boolean;
  deliveryInfo: {
    location: string;
    estimatedDelivery: number;
    isCodAvailable: boolean;
  } | null;
  locationPinCode: string | null;
}

export const ActionButtons = ({
  className = "",
  isSticky = false,
  productData,
  selectedVariant,
  locationPrice,
  selectedLocationGroupId,
  isProductAvailable,
  deliveryInfo,
  locationPinCode,
}: ActionButtonsProps) => {
  const { product, variant } = productData;
  const { addItem } = useCart();
  const router = useRouter();

  const onHandleCart = () => {
    if (!isProductAvailable) return;
    const itemPincode = locationPinCode || "";

    try {
      addItem({
        ...product,
        price: locationPrice.price,
        mrp: locationPrice.mrp,
        slug: variant.slug,
        selectedVariant,
        checkOutQuantity: 1,
        pincode: itemPincode,
        deliveryDays: deliveryInfo?.estimatedDelivery || 0,
        isCodAvailable: deliveryInfo?.isCodAvailable || false,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const onHandleBuyNow = () => {
    if (!isProductAvailable) return;
    const itemPincode = locationPinCode || "";

    try {
      addItem({
        ...product,
        price: locationPrice.price,
        mrp: locationPrice.mrp,
        slug: variant.slug,
        selectedVariant,
        checkOutQuantity: 1,
        pincode: itemPincode,
        deliveryDays: deliveryInfo?.estimatedDelivery || 0,
        isCodAvailable: deliveryInfo?.isCodAvailable || false,
      });
      router.push("/checkout/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className={cn("grid grid-cols-2 gap-x-4", className)}>
      <Button
        className="h-14 font-bold bg-[#ee8c1d] hover:bg-[#ee8c1d] text-white rounded-2xl"
        onClick={onHandleCart}
        disabled={selectedVariant.stock <= 0 || !isProductAvailable}
      >
        <HiShoppingBag className="mr-2 h-5 w-5" />
        Add TO Cart
      </Button>
      <Button
        className="h-14 font-bold bg-black hover:bg-black text-white rounded-2xl"
        onClick={onHandleBuyNow}
        disabled={selectedVariant.stock <= 0 || !isProductAvailable}
      >
        <IoBagHandle className="mr-2 h-5 w-5" />
        Buy Now
      </Button>
    </div>
  );
};
