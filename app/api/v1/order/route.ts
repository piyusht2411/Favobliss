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
      paymentMethod, // New field: "razorpay" or "cod"
      gstNumber, // New field: optional GST number
    }: {
      products: CartSelectedItem[];
      address: Address;
      paymentMethod: "razorpay" | "cod";
      gstNumber?: string;
    } = await request.json();

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!products || !address || !paymentMethod) {
      return new NextResponse("Invalid Credentials", { status: 400 });
    }

    // Validate GST number format (if provided)
    if (gstNumber) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(gstNumber)) {
        return new NextResponse("Invalid GST number format", { status: 400 });
      }
    }

    // Create frontend shipping address
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

    // Create frontend order
    const frontendOrder = await db.order.create({
      data: {
        userId: session.user.id,
        shippingId: shippingAddress.id,
        isPaid: paymentMethod === "cod" ? false : undefined,
        isCompleted: paymentMethod === "cod" ? true : false,
      },
    });

    // Create frontend order products
    const formattedProducts = products.map((product) => ({
      orderId: frontendOrder.id,
      productId: product.id,
      productImage: product.image,
      quantity: product.quantity,
      name: product.name,
      about: JSON.stringify({
        variantId: product.variantId,
        color: product.color || "",
        price: product.price,
        about: product.about,
        locationId: product.locationId,
      }),
      size: product.size || "",
    }));

    await db.orderProduct.createMany({
      data: formattedProducts,
    });

    // Create backend order
    try {
      const backendOrder = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`, // New backend order creation endpoint
        {
          orderItems: products.map((product) => ({
            variantId: product.variantId,
            quantity: product.quantity,
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
          isPaid: paymentMethod === "cod" ? false : undefined,
          isCompleted: paymentMethod === "cod" ? true : undefined,
          gstNumber: gstNumber || undefined,
        }
      );

      // Return order IDs for both systems
      return NextResponse.json({
        frontendOrderId: frontendOrder.id,
        backendOrderId: backendOrder.data.orderId,
      });
    } catch (error) {
      // Rollback frontend order and shipping address if backend fails
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
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json([]);
    }

    const response = await db.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderProduct: {
          include: {
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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
    const { isPaid }: { isPaid: boolean } = await request.json();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isPaid) {
      return new NextResponse("Invalid Credentials", { status: 400 });
    }

    await db.order.update({
      where: {
        id: params.orderId,
        userId: session.user.id,
      },
      data: {
        isPaid: isPaid,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ORDER PATCH API", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
