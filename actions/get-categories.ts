import { Category } from "@/types";

const URL = process.env.NEXT_PUBLIC_API_URL;

export const getCategories = async (storeId?: string): Promise<Category[]> => {
  if (!URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return [];
  }

  try {
    const url = storeId
      ? `${URL}/categories?storeId=${storeId}`
      : `${URL}/categories`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Failed to fetch categories: ${res.status} ${res.statusText}`
      );
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
