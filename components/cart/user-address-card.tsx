"use client";

import { Address } from "@prisma/client";
import { AddressCard } from "./address-card";
import { useAddessModal } from "@/hooks/use-address-modal";
import { useCart } from "@/hooks/use-cart";
import { useCheckoutAddress } from "@/hooks/use-checkout-address";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

interface UserAddressCardProps {
  data: Address[];
  label?: boolean;
}

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mismatchedCount: number;
  newPincode: string;
  isLoading: boolean;
}

const PricingDialog = ({
  isOpen,
  onClose,
  onConfirm,
  mismatchedCount,
  newPincode,
  isLoading,
}: PricingDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full">
            <svg
              className="w-6 h-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Update Cart Prices?
          </h3>

          <p className="text-sm text-gray-600 text-center mb-6">
            <span className="font-medium">{mismatchedCount} item(s)</span> in
            your cart were added for a different pincode. Kindly change your
            address.
            {/* update prices for <span className="font-medium">{newPincode}</span>? */}
          </p>

          {/* <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Prices"
              )}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export const UserAddressCard = ({ data, label }: UserAddressCardProps) => {
  const { onOpen } = useAddessModal();
  const { items, updateItemPrice, removeItem } = useCart();
  const { addAddress } = useCheckoutAddress();
  const router = useRouter();
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [mismatchedItems, setMismatchedItems] = useState<any[]>([]);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  const defaultAddress =
    data && data.find((address) => address.isDefault === true);
  const otherAddresses =
    data && data.filter((address) => address.isDefault === false);

  const handleAddressSelect = async (address: Address) => {
    // Check if all items match the new address pincode
    const mismatched = items.filter(
      (item) => String(item.pincode) !== String(address.zipCode)
    );

    if (mismatched.length === 0) {
      // No conflicts - proceed normally
      addAddress(address);
      router.push("/checkout/payment");
      return;
    }

    // Show custom dialog for price update confirmation
    setSelectedAddress(address);
    setMismatchedItems(mismatched);
    setShowPricingDialog(true);
  };

  const handlePriceUpdate = async () => {
    if (!selectedAddress || mismatchedItems.length === 0) return;

    setIsUpdatingPrices(true);

    try {
      // Call API to get updated prices
      const response = await axios.post("/api/v1/products/variant-prices", {
        variantIds: mismatchedItems.map((item) => item.selectedVariant.id),
        pincode: selectedAddress.zipCode,
      });

      // Update cart with new prices
      mismatchedItems.forEach((item) => {
        const newPrice = response.data[item.selectedVariant.id];
        if (newPrice) {
          updateItemPrice(
            item.selectedVariant.id,
            newPrice,
            String(selectedAddress.zipCode)
          );
          toast.success(`Updated price for ${item.name}`);
        } else {
          removeItem(item.selectedVariant.id);
          toast.warning(
            `Removed ${item.name} - unavailable at ${selectedAddress.zipCode}`
          );
        }
      });

      addAddress(selectedAddress);
      setShowPricingDialog(false);
      router.push("/checkout/payment");
    } catch (error) {
      toast.error("Failed to update prices for selected address");
      console.error(error);
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  const handleDialogClose = () => {
    setShowPricingDialog(false);
    setSelectedAddress(null);
    setMismatchedItems([]);
  };

  return (
    <>
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

      <PricingDialog
        isOpen={showPricingDialog}
        onClose={handleDialogClose}
        onConfirm={handlePriceUpdate}
        mismatchedCount={mismatchedItems.length}
        newPincode={selectedAddress ? String(selectedAddress.zipCode) : ""}
        isLoading={isUpdatingPrices}
      />
    </>
  );
};
