"use server";

import { db } from "@/lib/db";
import axios from "axios";
import { OrderProduct, Comment, Order, ShippingAddress } from "@prisma/client";

export interface EnrichedOrderProduct extends OrderProduct {
  comment: Comment | null;
  status: string;
  estimatedDeliveryDays: number | null;
  orderNumber: string | null;
  isPaid: boolean;
  isCompleted: boolean;
  createdAt: Date;
  shippingAddress: { id: string; [key: string]: any };
  mrp: number | null; // Added
  price: number | null; // Added
  paymentMethod: string | null; // Added
}

export interface EnrichedOrder extends Order {
  orderProduct: (OrderProduct & { comment: Comment | null })[];
  shippingAddress: ShippingAddress;
  status: string;
  estimatedDeliveryDays: number | null;
  orderNumber: string | null;
  mrp: number | null; // Added
  price: number | null; // Added
  paymentMethod: string | null; // Added
}

export const getOrderProductById = async (
  id: string
): Promise<EnrichedOrderProduct | null> => {
  try {
    const orderProduct = await db.orderProduct.findUnique({
      where: { id },
      include: {
        comment: true,
        order: {
          include: {
            shippingAddress: true,
          },
        },
      },
    });

    if (!orderProduct || !orderProduct.order) {
      return null;
    }

    let backendOrder: any = null;
    if (orderProduct.order.orderNumber) {
      try {
        const backendResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/number/${orderProduct.order.orderNumber}`
        );
        backendOrder = backendResponse.data;
      } catch (error) {
        console.error("Error fetching backend order:", error);
      }
    }

    return {
      ...orderProduct,
      status: backendOrder?.status || "PENDING",
      estimatedDeliveryDays: backendOrder?.estimatedDeliveryDays || null,
      orderNumber: orderProduct.order.orderNumber || "Pending",
      isPaid: orderProduct.order.isPaid,
      isCompleted: orderProduct.order.isCompleted,
      createdAt: orderProduct.order.createdAt,
      shippingAddress: orderProduct.order.shippingAddress,
      mrp: orderProduct.order.mrp || null, // Include frontend MRP
      price: orderProduct.order.price || null, // Include frontend price
      paymentMethod: orderProduct.order.paymentMethod || null,
    };
  } catch (error) {
    console.error("FRONTEND GET ORDER PRODUCT BY ID", error);
    return null;
  }
};

export const getOrder = async (id: string): Promise<EnrichedOrder | null> => {
  try {
    // Fetch the frontend order with relations
    const frontendOrder = await db.order.findUnique({
      where: { id },
      include: {
        orderProduct: {
          include: {
            comment: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!frontendOrder) {
      return null;
    }

    // Fetch the backend order by orderNumber
    let backendOrder: any = null;
    if (frontendOrder.orderNumber) {
      try {
        const backendResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/number/${frontendOrder.orderNumber}`
        );
        backendOrder = backendResponse.data;
      } catch (error) {
        console.error("Error fetching backend order:", error);
        // Continue with frontend data if backend fails
      }
    }

    // Enrich the frontend order with backend data
    return {
      ...frontendOrder,
      status: backendOrder?.status || "PENDING",
      estimatedDeliveryDays: backendOrder?.estimatedDeliveryDays || null,
      orderNumber: frontendOrder.orderNumber || "Pending",
      isPaid: frontendOrder.isPaid,
      isCompleted: frontendOrder.isCompleted,
      createdAt: frontendOrder.createdAt,
      shippingAddress: frontendOrder.shippingAddress,
      mrp: frontendOrder.mrp || null, // Include frontend MRP
      price: frontendOrder.price || null, // Include frontend price
      paymentMethod: frontendOrder.paymentMethod || null,
    };
  } catch (error) {
    console.error("FRONTEND GET ORDER BY ID", error);
    return null;
  }
};
