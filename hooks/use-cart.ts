import { Product, Variant } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem extends Product {
  checkOutQuantity: number;
  selectedVariant: Variant;
  price: number; // Add location-based price
  // locationId?: string | null; // Add locationId
  pincode: string;
}

interface UseCart {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  updateItemPrice: (
    variantId: string,
    newPrice: number,
    newPincode: string
  ) => void;
  removeItem: (variantId: string) => void;
  removeAll: () => void;
  getItemCount: () => number;
  getTotalAmount: () => number;
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
          set({ items: [...currentItems, data] });
          toast.success("Item added to cart");
        }
      },
      updateQuantity: (variantId: string, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.selectedVariant.id === variantId
        );
        if (!existingItem) {
          toast.info("Item does not exist in cart");
        } else {
          const updatedItems = currentItems.map((item) => {
            if (item.selectedVariant.id === variantId) {
              return {
                ...item,
                checkOutQuantity: quantity,
              };
            }
            return item;
          });
          set({ items: updatedItems });
        }
      },
      updateItemPrice: (
        variantId: string,
        newPrice: number,
        newPincode: string
      ) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.selectedVariant.id === variantId
              ? { ...item, price: newPrice, pincode: newPincode }
              : item
          ),
        }));
      },
      removeItem: (variantId: string) => {
        set({
          items: [
            ...get().items.filter(
              (item) => item.selectedVariant.id !== variantId
            ),
          ],
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
    }),
    {
      name: "store-cart-items",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
