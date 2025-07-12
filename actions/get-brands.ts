import { Brand } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/brands`;

export const getBrands = async (): Promise<Brand> => {
  const res = await fetch(`${URL}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Brands not found");
  }
  return res.json();
};
