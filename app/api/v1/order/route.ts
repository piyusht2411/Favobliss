import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { CartSelectedItem } from "@/types";
import { Address } from "@prisma/client";
import { db } from "@/lib/db";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const {
      products,
      address,
      paymentMethod,
      gstNumber,
      discount,
    }: {
      products: CartSelectedItem[];
      address: Address;
      paymentMethod: "razorpay" | "cod";
      gstNumber?: string;
      discount?: number;
    } = await request.json();

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!products || !address || !paymentMethod) {
      return new NextResponse("Invalid Credentials", { status: 400 });
    }

    if (gstNumber) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(gstNumber)) {
        return new NextResponse("Invalid GST number format", { status: 400 });
      }
    }

    const shippingAddress = await db.shippingAddress.create({
      data: {
        name: address.name,
        address: address.address,
        district: address.district,
        landmark: address.landmark,
        mobileNumber: address.phoneNumber,
        state: address.state,
        town: address.town,
        zipCode: address.zipCode,
      },
    });

    const mrp = products.reduce(
      (total, product) =>
        total + (product.mrp || product.price) * product.quantity,
      0
    );
    const price = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    const frontendOrder = await db.order.create({
      data: {
        userId: session.user.id,
        shippingId: shippingAddress.id,
        isPaid: paymentMethod === "cod" ? false : undefined,
        isCompleted: false,
        mrp,
        price: discount && discount > 0 ? price - discount : price,
        discount: discount || 0,
        paymentMethod,
      },
    });

    const formattedProducts = products.map((product) => ({
      orderId: frontendOrder.id,
      productId: product.id,
      productImage: product.image,
      quantity: product.quantity,
      name: product.name,
      about: JSON.stringify({
        variantId: product.variantId,
        color: product.color || "",
        price:
          discount && discount > 0 ? product.price - discount : product.price,
        about: product.about,
        locationId: product.locationId,
      }),
      size: product.size || "",
    }));

    await db.orderProduct.createMany({
      data: formattedProducts,
    });

    try {
      const backendOrder = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          orderItems: products.map((product) => ({
            variantId: product.variantId,
            quantity: product.quantity,
            price: product.price,
            mrp: product.mrp,
            name: product.name,
          })),
          phone: address.phoneNumber,
          address: [
            address.address || "",
            address.landmark || "",
            address.town || "",
            address.district || "",
            address.state || "",
            address.zipCode || "",
          ]
            .filter((c) => c)
            .join(", "),
          zipCode: address.zipCode.toString(),
          isPaid: paymentMethod === "cod" ? false : false,
          gstNumber: gstNumber || undefined,
          discount: discount || 0,
          customerId: session.user.id,
          customerName: session.user.name || "",
          customerEmail: session.user.email || "",
        }
      );

      const { id: backendOrderId, orderNumber } = backendOrder.data;

      await db.order.update({
        where: { id: frontendOrder.id },
        data: { backendOrderId, orderNumber },
      });

      return NextResponse.json({
        frontendOrderId: frontendOrder.id,
        backendOrderId,
      });
    } catch (error) {
      await db.order.delete({ where: { id: frontendOrder.id } });
      await db.shippingAddress.delete({ where: { id: shippingAddress.id } });
      throw error;
    }
  } catch (error) {
    console.error("ORDER POST API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(_request: Request) {
  // Existing GET logic unchanged...
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json([]);
    }

    const response = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderProduct: { include: { comment: true } },
        shippingAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("ORDER GET API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

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
