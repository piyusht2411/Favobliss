import { Product } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${URL}/${id}`, { cache: "no-store" });
  return res.json();
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const res = await fetch(`${URL}?slug=${slug}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Product not found");
  }
  return res.json();
};

export const getRecentlyViewedProducts = async (
  productIds: string[],
  locationId?: string
): Promise<Product[]> => {
  try {
    const response = await axios.post(
      `${URL}/recently-viewed`,
      { productIds, locationId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("[GET_RECENTLY_VIEWED_PRODUCTS]", error);
    throw new Error("Failed to fetch recently viewed products");
  }
};
