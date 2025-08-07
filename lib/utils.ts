import { Category } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const getCategories = (
  key: string,
  type: "TOPWEAR" | "BOTTOMWEAR" | "FOOTWEAR" | "INNERWEARANDSLEEPWEAR",
  category: Category[]
) => {
  const formattedCategory = category.filter(
    (c) => c.classification.toString() === type
  );
  const categoryURL = formattedCategory.map((c) => ({
    url: `/category/${c.id}?category=${key}&page=1`,
    label: c.name,
  }));
  return categoryURL;
};

export const formatDeliveryDate = (deliveryDays: number | null): string => {
  const today = new Date();
  if (deliveryDays === null || deliveryDays === undefined) {
    return "Delivery date not available";
  }
  if (deliveryDays === 0) {
    return "Today";
  }
  if (deliveryDays === 1) {
    return "Tomorrow";
  }
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryDays);
  return deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
