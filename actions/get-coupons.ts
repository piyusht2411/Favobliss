import { Coupons } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/coupons`;

export const getCoupons = async (): Promise<Coupons[]> => {
  const res = await fetch(URL);
  return res.json();
};
