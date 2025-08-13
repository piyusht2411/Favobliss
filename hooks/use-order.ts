// frontend: hooks/use-order.ts
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { Order, OrderProduct, Comment, ShippingAddress } from "@prisma/client";

export interface EnrichedOrder extends Order {
  orderProduct: (OrderProduct & { comment: Comment | null })[];
  shippingAddress: ShippingAddress;
  status: string;
  estimatedDeliveryDays: number | null;
  orderNumber: string | null;
}

export const useOrder = () => {
  const { data, error, isLoading, mutate } = useSWR<EnrichedOrder[]>(
    "/api/v1/order/enriched",
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
