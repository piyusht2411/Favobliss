import { Product } from "@/types";

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
