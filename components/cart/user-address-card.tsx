"use client";

import { Address } from "@prisma/client";
import { AddressCard } from "./address-card";
import { useAddessModal } from "@/hooks/use-address-modal";
import { useCart } from "@/hooks/use-cart";
import { useCheckoutAddress } from "@/hooks/use-checkout-address";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

interface UserAddressCardProps {
  data: Address[];
  label?: boolean;
}

export const UserAddressCard = ({ data, label }: UserAddressCardProps) => {
  const { onOpen } = useAddessModal();
  const { items, updateItemPrice, removeItem } = useCart();
  const { addAddress } = useCheckoutAddress();
  const router = useRouter();

  const defaultAddress =
    data && data.find((address) => address.isDefault === true);
  const otherAddresses =
    data && data.filter((address) => address.isDefault === false);

  const handleAddressSelect = async (address: Address) => {
    // Check if all items match the new address pincode
    const mismatchedItems = items.filter(
      (item) => String(item.pincode) !== String(address.zipCode)
    );

    if (mismatchedItems.length === 0) {
      // No conflicts - proceed normally
      addAddress(address);
      router.push("/checkout/payment");
      return;
    }

    try {
      // Show confirmation before updating prices
      const confirmUpdate = window.confirm(
        `${mismatchedItems.length} item(s) in your cart were added for a different pincode. ` +
          `Would you like to update prices for ${address.zipCode}?`
      );

      if (!confirmUpdate) return;

      // Call API to get updated prices
      const response = await axios.post("/api/v1/products/variant-prices", {
        variantIds: mismatchedItems.map((item) => item.selectedVariant.id),
        pincode: address.zipCode,
      });

      // Update cart with new prices
      mismatchedItems.forEach((item) => {
        const newPrice = response.data[item.selectedVariant.id];
        if (newPrice) {
          updateItemPrice(
            item.selectedVariant.id,
            newPrice,
            String(address.zipCode)
          );
          toast.success(`Updated price for ${item.name}`);
        } else {
          removeItem(item.selectedVariant.id);
          toast.warning(
            `Removed ${item.name} - unavailable at ${address.zipCode}`
          );
        }
      });

      addAddress(address);
      router.push("/checkout/payment");
    } catch (error) {
      toast.error("Failed to update prices for selected address");
      console.error(error);
    }
  };

  return (
    <div className="p-4 w-full rounded-sm space-y-6">
      {data.length > 1 && !label && (
        <h3 className="text-lg md:text-xl font-bold text-zinc-800">
          Select Address
        </h3>
      )}
      {defaultAddress && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-600">
            DEFAULT ADDRESS
          </h3>
          <AddressCard data={defaultAddress} onSelect={handleAddressSelect} />
        </div>
      )}
      {otherAddresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-600">
            OTHER ADDRESSES
          </h3>
          {otherAddresses.map((address) => (
            <AddressCard
              key={address.id}
              data={address}
              onSelect={handleAddressSelect}
            />
          ))}
        </div>
      )}
      <div
        className="w-full aspect-[6/1] border border-dashed rounded-md flex items-center justify-center bg-gray-100 cursor-default md:cursor-pointer"
        onClick={onOpen}
      >
        <p className="text-md font-bold">Add New Address</p>
      </div>
    </div>
  );
};
