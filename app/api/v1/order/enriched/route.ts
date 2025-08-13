// frontend: pages/api/orders/enriched.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import axios from "axios";
import { Order, OrderProduct, Comment, ShippingAddress } from "@prisma/client";

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

export async function GET(_request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json([]);
    }

    // Fetch frontend orders
    const frontendOrders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderProduct: { include: { comment: true } },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all backend orders for this user in one call
    let backendOrders: any[] = [];
    try {
      const backendResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/customer/${session.user.id}`
      );
      backendOrders = backendResponse.data;
    } catch (error) {
      console.error("Error fetching backend orders:", error);
      // Continue with frontend orders if backend fails
    }

    // Enrich frontend orders with backend data
    const enrichedOrders = frontendOrders.map((frontendOrder) => {
      const backendOrder = backendOrders.find(
        (bo) => bo.id === frontendOrder.backendOrderId
      );

      return {
        ...frontendOrder,
        status: backendOrder?.status || "PENDING",
        estimatedDeliveryDays: backendOrder?.estimatedDeliveryDays || null,
        orderNumber: frontendOrder.orderNumber || "Pending",
        mrp: frontendOrder.mrp || null, // Include frontend MRP
        price: frontendOrder.price || null, // Include frontend price
        paymentMethod: frontendOrder.paymentMethod || null, // Include frontend payment method
      };
    });

    return NextResponse.json(enrichedOrders);
  } catch (error) {
    console.error("ENRICHED ORDERS GET API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
