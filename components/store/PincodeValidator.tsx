"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
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

      // Get unique original pincodes
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

  //   const handleUpdatePrices = async () => {
  //     if (!address) return;

  //     setLoading(true);
  //     try {
  //       const response = await axios.post(
  //         `${process.env.NEXT_PUBLIC_API_URL}/products/variant-price`,
  //         {
  //           variantIds: items.map((item) => item.selectedVariant.id),
  //           pincode: address.zipCode,
  //         }
  //       );

  //       // Update cart with new prices
  //       items.forEach((item) => {
  //         const newPrice = response.data[item.selectedVariant.id];
  //         if (newPrice) {
  //           updateItemPrice(
  //             item.selectedVariant.id,
  //             newPrice,
  //             String(address.zipCode)
  //           );
  //         } else {
  //           removeItem(item.selectedVariant.id);
  //           toast.warning(`Removed ${item.name} - unavailable at new pincode`);
  //         }
  //       });
  //       toast.success("Cart updated for new pincode");
  //     } catch (error) {
  //       toast.error("Failed to update prices");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  if (!address || mismatchedItems === 0) return null;

  return (
    <div className="bg-yellow-50 border-yellow-200 border rounded-lg p-4 mb-6 mt-10">
      <h3 className="font-bold text-yellow-800">Pincode Conflict</h3>
      <p className="text-yellow-700 mt-2">
        {mismatchedItems} item{mismatchedItems > 1 ? "s" : ""} in your cart were
        added for a different pincode{" "}
        {originalPincodes.length > 0 && `(${originalPincodes.join(", ")})`}
      </p>

      {/* <div className="flex gap-3 mt-4">
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
      </div> */}
    </div>
  );
};
