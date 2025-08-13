import { CartSelectedItem, Coupons } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UseCheckOutProps {
  checkOutItems: CartSelectedItem[];
  appliedCoupon: Coupons | null;
  discount: number;
  selectItem: (data: CartSelectedItem) => void;
  updateItem: (variantId: string, quantity: number) => void;
  removeSelectedItems: (variantId: string) => void;
  setCheckOutItems: (items: CartSelectedItem[]) => void;
  clearCheckOutItems: () => void;
  addItem: (data: CartSelectedItem) => void;
  updateItemCheckoutPrice: (
    variantId: string,
    price: number,
    mrp: number, // Added
    locationId: string
  ) => void;
  applyCoupon: (coupon: Coupons) => void;
  removeCoupon: () => void;
  setDiscount: (discount: number) => void;
}

export const useCheckout = create(
  persist<UseCheckOutProps>(
    (set, get) => ({
      checkOutItems: [],
      appliedCoupon: null,
      discount: 0,
      selectItem: (data: CartSelectedItem) => {
        const currentItems = get().checkOutItems;
        const isAlreadyExist = currentItems.find(
          (item) => item.variantId === data.variantId
        );

        if (isAlreadyExist) {
          set({
            checkOutItems: [
              ...currentItems.filter(
                (item) => item.variantId !== data.variantId
              ),
            ],
          });
        } else {
          set({
            checkOutItems: [
              ...currentItems,
              { ...data, mrp: data.mrp || data.price }, // Fallback to price
            ],
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
            checkOutItems: [
              ...currentItems,
              { ...data, mrp: data.mrp || data.price }, // Fallback to price
            ],
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
      updateItemCheckoutPrice: (
        variantId: string,
        price: number,
        mrp: number,
        locationId: string
      ) => {
        const currentItems = get().checkOutItems;
        const itemIndex = currentItems.findIndex(
          (item) => item.variantId === variantId
        );

        if (itemIndex !== -1) {
          const updatedItems = [...currentItems];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            price,
            mrp, // Added
            locationId,
          };
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
      clearCheckOutItems: () =>
        set({ checkOutItems: [], appliedCoupon: null, discount: 0 }),
      applyCoupon: (coupon: Coupons) =>
        set({ appliedCoupon: coupon, discount: coupon.value }),
      removeCoupon: () => set({ appliedCoupon: null, discount: 0 }),
      setDiscount: (discount: number) => set({ discount }),
    }),
    {
      name: "store-checkout-items",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
