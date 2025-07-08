import { Location } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/location`;

export const getLocations = async (storeId: string): Promise<Location[]> => {
  const res = await fetch(`${URL}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch locations");
  }
  return res.json();
};
