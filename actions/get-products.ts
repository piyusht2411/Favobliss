import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;
const HOT_DEALS_URL = `${process.env.NEXT_PUBLIC_API_URL}/products/hot-deals`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  limit?: string;
  page?: string;
  type?: "MEN" | "WOMEN" | "KIDS" | "BEAUTY" | "ELECTRONICS";
  price?: string;
}

interface HotDealsQuery extends Query {
  timeFrame?: "7 days" | "30 days" | "90 days" | "all time";
}

export const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      colorId: query.colorId,
      sizeId: query.sizeId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      limit: query.limit,
      type: query.type,
      price: query.price,
      page: query.page,
    },
  });

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("getProducts fetch error:", res.status, res.statusText);
      return [];
    }

    const text = await res.text();

    if (!text) {
      console.warn("getProducts: empty response");
      return [];
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("getProducts JSON parse or network error:", error);
    return [];
  }
};

export const getHotDeals = async (query: HotDealsQuery): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: HOT_DEALS_URL,
    query: {
      categoryId: query.categoryId,
      limit: query.limit,
      page: query.page,
      timeFrame: query.timeFrame,
    },
  });

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("getHotDeals fetch error:", res.status, res.statusText);
      return [];
    }

    const text = await res.text();

    if (!text) {
      console.warn("getHotDeals: empty response");
      return [];
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("getHotDeals JSON parse or network error:", error);
    return [];
  }
};
