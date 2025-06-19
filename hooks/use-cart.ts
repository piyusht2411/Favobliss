import { Product } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UseCart {
  items: (Product & {
    checkOutQuantity: number;
  })[];
  addItem: (
    data: Product & {
      checkOutQuantity: number;
    }
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  getItemCount: () => number; // Add getter for item count
  getTotalAmount: () => number; // Add getter for total amount
}

export const useCart = create(
  persist<UseCart>(
    (set, get) => ({
      items: [],
      addItem: (data: Product & { checkOutQuantity: number }) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);
        if (existingItem) {
          toast.info("Item already in cart");
        } else {
          set({ items: [...currentItems, data] });
          toast.success("Item added to cart");
        }
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === id);
        if (!existingItem) {
          toast.info("Item does not exist in cart");
        } else {
          const updatedItems = currentItems.map((item) => {
            if (item.id === id)
              return {
                ...item,
                checkOutQuantity: quantity,
              };
            else return item;
          });

          set({ items: updatedItems });
        }
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter((item) => item.id !== id)],
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
