import { Brand } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/brands`;

export const getBrandBySlug = async (slug: string): Promise<Brand> => {
  const res = await fetch(`${URL}?slug=${slug}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Product not found");
  }
  return res.json();
};
