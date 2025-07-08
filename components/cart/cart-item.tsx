"use client";

import { CartSelectedItem, Product } from "@/types";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { QuantityModal } from "../modals/quantity-modal";
import { useCart } from "@/hooks/use-cart";
import { useCheckout } from "@/hooks/use-checkout";

interface CartItemProps {
  data: Product & {
    checkOutQuantity: number;
    selectedVariant: any;
    price: number;
    locationId?: string | null;
  };
}

export const CartItem = ({ data }: CartItemProps) => {
  const { items, removeItem, updateQuantity } = useCart();
  const { checkOutItems, selectItem, removeSelectedItems, updateItem } =
    useCheckout();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(
    items.find((item) => item.selectedVariant.id === data.selectedVariant.id)
      ?.checkOutQuantity || 1
  );

  const isChecked = !!checkOutItems.find(
    (item) => item.variantId === data.selectedVariant.id
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectItem = () => {
    const formattedData: CartSelectedItem = {
      id: data.id,
      variantId: data.selectedVariant.id,
      price: data.price,
      quantity,
      image: data.selectedVariant.images[0]?.url || "",
      about: data.about,
      name: data.name,
      size: data.selectedVariant.size?.value,
      color: data.selectedVariant.color?.name,
      selectedVariant: data.selectedVariant,
      locationId: data.locationId,
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

  useEffect(() => {
    if (mounted && quantity !== data.checkOutQuantity) {
      updateQuantity(data.selectedVariant.id, quantity);

      if (isChecked) {
        updateItem(data.selectedVariant.id, quantity);
      }
    }
  }, [
    quantity,
    data.selectedVariant.id,
    data.checkOutQuantity,
    updateQuantity,
    updateItem,
    isChecked,
    mounted,
  ]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <QuantityModal
        open={open}
        quantity={quantity}
        setOpen={setOpen}
        setQuantity={setQuantity}
        stock={data.selectedVariant.stock}
        productId={data.selectedVariant.id}
      />
      <li className="flex py-4 px-2 md:px-4 rounded-md border">
        <div className="relative h-32 w-24 rounded-md overflow-hidden sm:h-48 sm:w-36">
          {data.selectedVariant.images[0]?.url ? (
            <Image
              src={data.selectedVariant.images[0].url}
              alt={data.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full" />
          )}
          <div className="absolute left-2 top-2">
            <Checkbox checked={isChecked} onCheckedChange={handleSelectItem} />
          </div>
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="absolute z-10 right-0 -top-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveItem}
            >
              <X className="text-zinc-600" />
            </Button>
          </div>
          <div className="relative pr-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div className="flex flex-col">
              <p className="md:text-lg font-bold text-zinc-700 max-w-36 md:max-w-sm truncate">
                {data.name}
              </p>
              <p className="text-sm font-semibold max-w-36 md:max-w-sm text-zinc-600 truncate">
                {data.about}
              </p>
              <div className="md:my-3 md:space-y-2">
                {data.selectedVariant.size?.value && (
                  <p className="font-semibold">
                    Size - {data.selectedVariant.size.value}
                  </p>
                )}
                {data.selectedVariant.color?.name && (
                  <p className="font-semibold">
                    Color - {data.selectedVariant.color.name}
                  </p>
                )}
                <p className="font-extrabold">{formatter.format(data.price)}</p>
              </div>
              <div
                className="font-semibold text-zinc-700 cursor-default md:cursor-pointer"
                role="button"
                onClick={() => setOpen(true)}
              >
                Qty - {quantity}
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};
