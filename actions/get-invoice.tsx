import { InvoiceData } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders/invoice`;

export const getInvoice = async (id: string): Promise<InvoiceData> => {
  const res = await fetch(`${URL}/${id}`);
  return res.json();
};
