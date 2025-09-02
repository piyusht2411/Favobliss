"use client";

import { getProducts } from "@/actions/get-products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-checkout";
import { useCheckoutAddress } from "@/hooks/use-checkout-address";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  handleAddressCorrect?: (value: boolean) => void;
}

export const PincodeValidator = (props: Props) => {
  const { handleAddressCorrect } = props;
  const { address } = useCheckoutAddress();
  const { updateItemCheckoutPrice } = useCheckout();
  const { items, updateItemPrice, removeItem } = useCart();
  const [mismatchedItems, setMismatchedItems] = useState<number>(0);
  const [originalPincodes, setOriginalPincodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (address && items.length > 0) {
      const mismatched = items.filter(
        (item) => String(item.pincode) !== String(address.zipCode)
      ).length;

      const uniquePincodes = Array.from(
        new Set(items.map((item) => item.pincode).filter(Boolean))
      );

      setMismatchedItems(mismatched);
      setOriginalPincodes(uniquePincodes);
    }
  }, [address, items]);

  useEffect(() => {
    if (!address || mismatchedItems === 0) {
      handleAddressCorrect?.(true);
    } else {
      handleAddressCorrect?.(false);
    }
  }, [address, mismatchedItems]);

  const handleUpdatePrices = async () => {
    if (!address || items.length === 0) return;

    setLoading(true);

    try {
      const { products: response } = await getProducts({
        variantIds: items.map((item) => item.selectedVariant.id).join(","),
        pincode: address.zipCode,
      });

      items.forEach((item) => {
        const product = response.find((p) =>
          p.variants?.some((v) => v.id === item.selectedVariant.id)
        );

        const variant = product?.variants.find(
          (v) => v.id === item.selectedVariant.id
        );

        const targetPincode = String(address.zipCode).trim();

        const variantPrice = variant?.variantPrices?.find((vp) => {
          const apiPincode = vp?.locationGroup?.locations?.find(
            (loc) => loc.pincode === targetPincode
          )?.pincode;
          return apiPincode === targetPincode;
        });

        if (variantPrice && variantPrice.price) {
          updateItemPrice(
            item.selectedVariant.id,
            variantPrice.price,
            variantPrice.mrp,
            String(address.zipCode),
            variantPrice.locationGroup.deliveryDays || 0,
            variantPrice.locationGroup.isCodAvailable || false
          );

          updateItemCheckoutPrice(
            item.selectedVariant.id,
            variantPrice.price,
            variantPrice.mrp,
            String(address.zipCode)
          );
          toast.success(`Updated price for ${item.variants[0].name}`);
        } else {
          toast.warning(
            `The product is unavailable at this location at ${address.zipCode}`
          );
        }
      });
    } catch (error) {
      console.log("Error details:", error);
      //@ts-ignore
      if (error?.response?.status === 400) {
        toast.error(
          "The entered pincode is invalid. Please enter a valid pincode or select a different address."
        );
        return;
      }
      toast.error("Failed to update prices for selected address");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!address || mismatchedItems === 0) return null;

  return (
    <div className="bg-yellow-50 border-yellow-200 border rounded-lg p-4 mb-6 mt-10">
      <h3 className="font-bold text-yellow-800">Pincode Conflict</h3>
      <p className="text-yellow-700 mt-2">
        {mismatchedItems} item{mismatchedItems > 1 ? "s" : ""} in your cart were
        added for a different pincode{" "}
        {originalPincodes.length > 0 && `(${originalPincodes.join(", ")})`}
      </p>

      <div className="flex gap-3 mt-4">
        <Button
          variant="outline"
          onClick={handleUpdatePrices}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Prices for New Pincode"}
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.push("/checkout/address")}
        >
          Select Different Address
        </Button>
      </div>
    </div>
  );
};
