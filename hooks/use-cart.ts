import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { Product, Variant } from "@/types";

interface CartItem extends Product {
  checkOutQuantity: number;
  selectedVariant: Variant;
  price: number;
  mrp: number;
  slug: string;
  pincode: string;
  deliveryDays: number;
  isCodAvailable: boolean;
}

interface UseCart {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  increaseQuantity: (variantId: string) => void;
  decreaseQuantity: (variantId: string) => void;
  updateItemPrice: (
    variantId: string,
    newPrice: number,
    newMrp: number, // Added
    newPincode: string,
    newDeliveryDays: number,
    isCodAvailable: boolean
  ) => void;
  removeItem: (variantId: string) => void;
  removeAll: () => void;
  getItemCount: () => number;
  getTotalAmount: () => number;
  getTotalMrp: () => number; // Added
}

export const useCart = create(
  persist<UseCart>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.selectedVariant.id === data.selectedVariant.id
        );
        if (existingItem) {
          toast.info("Item already in cart");
        } else {
          set({
            items: [
              ...currentItems,
              {
                ...data,
                checkOutQuantity: 1,
                mrp: data.mrp || data.price,
              },
            ],
          });
          toast.success("Item added to cart");
        }
      },
      updateQuantity: (variantId: string, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.selectedVariant.id === variantId
        );
        if (!existingItem || quantity < 1) return;
        const updatedItems = currentItems.map((item) =>
          item.selectedVariant.id === variantId
            ? { ...item, checkOutQuantity: quantity }
            : item
        );
        set({ items: updatedItems });
      },
      increaseQuantity: (variantId: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.selectedVariant.id === variantId
        );
        if (
          !existingItem ||
          existingItem.checkOutQuantity >= existingItem.selectedVariant.stock
        ) {
          toast.info("Cannot exceed stock limit");
          return;
        }
        const updatedItems = currentItems.map((item) =>
          item.selectedVariant.id === variantId
            ? { ...item, checkOutQuantity: item.checkOutQuantity + 1 }
            : item
        );
        set({ items: updatedItems });
      },
      decreaseQuantity: (variantId: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.selectedVariant.id === variantId
        );
        if (!existingItem || existingItem.checkOutQuantity <= 1) return;
        const updatedItems = currentItems.map((item) =>
          item.selectedVariant.id === variantId
            ? { ...item, checkOutQuantity: item.checkOutQuantity - 1 }
            : item
        );
        set({ items: updatedItems });
      },
      updateItemPrice: (
        variantId: string,
        newPrice: number,
        newMrp: number,
        newPincode: string,
        newDeliveryDays: number,
        isCodAvailable: boolean
      ) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.selectedVariant.id === variantId
              ? {
                  ...item,
                  price: newPrice,
                  mrp: newMrp,
                  pincode: newPincode,
                  deliveryDays: newDeliveryDays,
                  isCodAvailable: isCodAvailable,
                }
              : item
          ),
        }));
      },
      removeItem: (variantId: string) => {
        set({
          items: get().items.filter(
            (item) => item.selectedVariant.id !== variantId
          ),
        });
        toast.success("Item removed from cart");
      },
      removeAll: () => set({ items: [] }),
      getItemCount: () => {
        return get().items.reduce(
          (total, item) => total + item.checkOutQuantity,
          0
        );
      },
      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.checkOutQuantity,
          0
        );
      },
      getTotalMrp: () => {
        return get().items.reduce(
          (total, item) => total + item.mrp * item.checkOutQuantity,
          0
        );
      },
    }),
    {
      name: "store-cart-items",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
