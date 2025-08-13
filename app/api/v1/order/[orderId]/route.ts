import { auth } from "@/auth";
import { db } from "@/lib/db";
import axios from "axios";
import { NextResponse } from "next/server";

// export async function PATCH(
//   request: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   try {
//     const { isPaid, isCompleted }: { isPaid: boolean; isCompleted: boolean } =
//       await request.json();
//     const session = await auth();

//     if (!session || !session.user || !session.user.id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!isPaid) {
//       return new NextResponse("Invalid Credentials", { status: 401 });
//     }

//     await db.order.update({
//       where: {
//         id: params.orderId,
//         userId: session.user.id,
//       },
//       data: {
//         isPaid: isPaid,
//         isCompleted: isCompleted,
//       },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("ORDER PATCH API", error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { action, isPaid }: { action?: "cancel"; isPaid?: boolean } =
      await request.json();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Handle payment status update
    if (action !== "cancel" && isPaid !== undefined) {
      if (!isPaid) {
        return new NextResponse("Invalid Credentials", { status: 400 });
      }

      await db.order.update({
        where: { id: params.orderId, userId: session.user.id },
        data: { isPaid },
      });

      return NextResponse.json({ success: true });
    }

    // Handle cancellation
    if (action === "cancel") {
      // Fetch frontend order to get backendOrderId
      const frontendOrder = await db.order.findUnique({
        where: { id: params.orderId, userId: session.user.id },
      });

      if (!frontendOrder) {
        return new NextResponse("Order not found", { status: 404 });
      }

      if (frontendOrder.isCompleted) {
        return new NextResponse("Order cannot be canceled", { status: 400 });
      }

      // Update frontend order
      await db.order.update({
        where: { id: params.orderId, userId: session.user.id },
        data: { isCompleted: false },
      });

      // Call backend to cancel order
      if (frontendOrder.backendOrderId) {
        try {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/${frontendOrder.backendOrderId}/cancel`
          );
        } catch (error) {
          console.error("Error canceling backend order:", error);
          // Optionally rollback frontend cancellation if critical
          return new NextResponse("Failed to cancel order", { status: 500 });
        }
      }

      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("ORDER PATCH API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
