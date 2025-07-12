import { Location } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/location`;

export const getLocations = async (
  storeId: string,
  pincode?: string
): Promise<Location[]> => {
  let res;
  if (pincode) {
    res = await fetch(`${URL}/pincode=${pincode}`, { cache: "no-store" });
  } else {
    res = await fetch(`${URL}`, { cache: "no-store" });
  }

  if (!res.ok) {
    throw new Error("Failed to fetch locations");
  }
  return res.json();
};
