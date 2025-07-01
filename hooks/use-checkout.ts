import { CartSelectedItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UseCheckOutProps {
  checkOutItems: CartSelectedItem[];
  selectItem: (data: CartSelectedItem) => void;
  updateItem: (variantId: string, quantity: number) => void;
  removeSelectedItems: (variantId: string) => void;
  setCheckOutItems: (items: CartSelectedItem[]) => void; // Added for CartPage sync
  clearCheckOutItems: () => void;
  addItem: (data: CartSelectedItem) => void;
}

export const useCheckout = create(
  persist<UseCheckOutProps>(
    (set, get) => ({
      checkOutItems: [],
      selectItem: (data: CartSelectedItem) => {
        const currentItems = get().checkOutItems;
        // Check if the item is already selected by variantId
        const isAlreadyExist = currentItems.find(
          (item) => item.variantId === data.variantId
        );

        // If item exists, remove it (toggle off)
        if (isAlreadyExist) {
          set({
            checkOutItems: [
              ...currentItems.filter(
                (item) => item.variantId !== data.variantId
              ),
            ],
          });
        }
        // Otherwise, add the item
        else {
          set({
            checkOutItems: [...currentItems, data],
          });
        }
      },
      addItem: (data: CartSelectedItem) => {
        const currentItems = get().checkOutItems;
        const isAlreadyExist = currentItems.find(
          (item) => item.variantId === data.variantId
        );

        if (!isAlreadyExist) {
          set({
            checkOutItems: [...currentItems, data],
          });
        }
      },
      updateItem: (variantId: string, quantity: number) => {
        const currentItems = get().checkOutItems;
        const isExist = currentItems.find(
          (item) => item.variantId === variantId
        );

        if (isExist) {
          const updatedItems = currentItems.map((item) => {
            if (item.variantId === variantId) {
              return {
                ...item,
                quantity,
              };
            }
            return item;
          });
          set({ checkOutItems: updatedItems });
        }
      },
      removeSelectedItems: (variantId: string) =>
        set({
          checkOutItems: [
            ...get().checkOutItems.filter(
              (item) => item.variantId !== variantId
            ),
          ],
        }),
      setCheckOutItems: (items) => set({ checkOutItems: items }),
      clearCheckOutItems: () => set({ checkOutItems: [] }),
    }),
    {
      name: "store-checkout-items",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
