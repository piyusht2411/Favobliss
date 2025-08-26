import { LocationGroup } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/location-group`;

export const getLocationGroups = async (
  pincode?: string
): Promise<LocationGroup[]> => {
  let res;
  if (pincode) {
    res = await fetch(`${URL}/pincode=${pincode}`, { cache: "no-store" });
  } else {
    res = await fetch(`${URL}`, { cache: "no-store" });
  }

  if (!res.ok) {
    throw new Error("Failed to fetch location groups");
  }
  return res.json();
};

export const getLocationGroupById = async (
  id: string
): Promise<LocationGroup> => {
  const res = await fetch(`${URL}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch location group");
  }
  return res.json();
};
