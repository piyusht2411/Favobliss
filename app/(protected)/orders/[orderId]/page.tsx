import { getOrder, getOrderProductById, EnrichedOrder } from "@/actions/order";
import { Container } from "@/components/ui/container";
import { cn, formatter, formatDeliveryDate } from "@/lib/utils";
import Image from "next/image";
import { format, addHours, addDays } from "date-fns";
import { ShippingAddress } from "@/components/order/shipping-address";
import { Rating } from "@/components/order/rating";
import { Review } from "@/components/order/review";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  ArrowLeft,
  Phone,
  Mail,
  Shield,
  Map,
} from "lucide-react";
import Link from "next/link";
import { CancelOrderButton } from "@/components/store/CancelOrderButton";
import { DownloadInvoiceButton } from "@/components/store/DownloadInvoiceButton";

interface OrderDetailsPageProps {
  params: { orderId: string };
}

export const revalidate = 0;

const OrderDetailsPage = async ({ params }: OrderDetailsPageProps) => {
  const orderProduct = await getOrderProductById(params.orderId);

  if (!orderProduct) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The order you&#39;re looking for doesn&#39;t exist or has been
              removed.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const order = (await getOrder(orderProduct.orderId)) as EnrichedOrder | null;
  console.log("first", order);

  if (!order) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Details Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to load order details at this time.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 bg-[#ef9120] text-white rounded-lg hover:bg-[#ef9120] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          icon: Clock,
          label: "Order Pending",
          description:
            "Your order has been received and is awaiting processing.",
        };
      case "PROCESSING":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          icon: Package,
          label: "Processing",
          description: "Your order is being prepared for shipment.",
        };
      case "SHIPPED":
        return {
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          icon: Truck,
          label: "Shipped",
          description: "Your order has been shipped. Track it below.",
        };
      case "OUTOFDELIVERY":
        return {
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          icon: Map,
          label: "Out for Delivery",
          description: "Your order is out for delivery and will arrive soon.",
        };
      case "DELIVERED":
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          icon: CheckCircle,
          label: "Delivered",
          description: "Your order has been delivered.",
        };
      case "CANCELLED":
      case "RETURNED":
      case "REFUNDED":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
          label:
            status === "CANCELLED"
              ? "Cancelled"
              : status === "RETURNED"
              ? "Returned"
              : "Refunded",
          description:
            status === "CANCELLED"
              ? "Your order has been cancelled."
              : status === "RETURNED"
              ? "Your order has been returned."
              : "Your order has been refunded.",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: Package,
          label: "Unknown",
          description: "Status is unknown.",
        };
    }
  };

  const getTimelineSteps = (status: string, createdAt: Date) => {
    const steps = [
      {
        status: "PENDING",
        timestamp: createdAt,
        ...getStatusInfo("PENDING"),
      },
      {
        status: "PROCESSING",
        timestamp: addHours(createdAt, 1),
        ...getStatusInfo("PROCESSING"),
      },
      {
        status: "SHIPPED",
        timestamp: addDays(createdAt, 1),
        ...getStatusInfo("SHIPPED"),
        trackingLink: "https://example.com/track",
      },
      {
        status: "OUTOFDELIVERY",
        timestamp: addDays(createdAt, 2),
        ...getStatusInfo("OUTOFDELIVERY"),
        trackingLink: "https://example.com/track",
      },
      {
        status: "DELIVERED",
        timestamp: addDays(createdAt, 3),
        ...getStatusInfo("DELIVERED"),
      },
    ];

    if (["CANCELLED", "RETURNED", "REFUNDED"].includes(status)) {
      return [
        {
          status,
          timestamp: addHours(createdAt, 1),
          ...getStatusInfo(status),
        },
      ];
    }

    const statusOrder = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "OUTOFDELIVERY",
      "DELIVERED",
    ];
    const currentIndex = statusOrder.indexOf(status);
    return steps.slice(0, currentIndex + 1);
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const timelineSteps = getTimelineSteps(order.status, order.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Container>
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/orders"
              className="inline-flex items-center text-[#ef9120] hover:text-[#ef9120] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Order #{order.orderNumber || "Pending"}
                </h1>
                <p className="text-gray-600 mt-1">
                  Placed on {format(order.createdAt, "EEEE, MMMM dd, yyyy")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <DownloadInvoiceButton orderId={order.backendOrderId || ""} />
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                    statusInfo.bgColor,
                    statusInfo.color,
                    statusInfo.borderColor,
                    "border"
                  )}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status Card */}
              {order.status !== "DELIVERED" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div
                    className={cn(
                      "px-6 py-4 border-b",
                      order.isPaid
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-blue-50 border-blue-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          order.isPaid ? "bg-emerald-100" : "bg-blue-100"
                        )}
                      >
                        {order.isPaid ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "font-semibold",
                            order.isPaid ? "text-emerald-900" : "text-blue-900"
                          )}
                        >
                          {order.isPaid
                            ? "Payment Confirmed"
                            : "Payment Pending"}
                        </h3>
                        <p
                          className={cn(
                            "text-sm",
                            order.isPaid ? "text-emerald-700" : "text-blue-700"
                          )}
                        >
                          On {format(order.createdAt, "EEEE, dd LLL yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* {order.status === "DELIVERED" && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Rate & Review
                        </h4>
                        <p className="text-sm text-gray-600">
                          Share your experience with this product
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Rating
                          comment={orderProduct.comment}
                          orderProductId={orderProduct.id}
                          productId={orderProduct.productId}
                        />
                        <Review
                          comment={orderProduct.comment}
                          orderProductId={orderProduct.id}
                          productId={orderProduct.productId}
                          productImage={orderProduct.productImage}
                          productName={orderProduct.about}
                        />
                      </div>
                    </div>
                  </div>
                )} */}
                </div>
              )}

              {/* Product Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">
                    Product Details
                  </h3>
                </div>

                {order.orderProduct.map((product) => {
                  return (
                    <div className="p-6" key={product.id}>
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-32 h-40 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.productImage}
                              width={128}
                              height={160}
                              alt="Product Image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <Link
                            href={`/product/${product.slug}`}
                            className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 block"
                          >
                            {product.name}
                          </Link>
                          {!product.about.startsWith("{") && (
                            <p className="text-gray-600 mb-4">
                              {product.about}
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Size:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {product.size}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Color:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {product.color}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Quantity:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {product.quantity || 1}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Payment Method:
                              </span>
                              <span className="ml-2 font-medium text-gray-900">
                                {orderProduct.paymentMethod === "cod"
                                  ? "Cash on Delivery"
                                  : "Online Payment"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">MRP:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {formatter.format(
                                  product.mrp || product.price || 0
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {formatter.format(product.price || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* <div className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-40 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={orderProduct.productImage}
                          width={128}
                          height={160}
                          alt="Product Image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {orderProduct.name}
                      </h4>
                      {!orderProduct.about.startsWith("{") && (
                        <p className="text-gray-600 mb-4">
                          {orderProduct.about}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {orderProduct.size}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Color:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {orderProduct.color}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {orderProduct.quantity || 1}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {orderProduct.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : "Online Payment"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">MRP:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {formatter.format(
                              orderProduct.mrp || orderProduct.price || 0
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {formatter.format(orderProduct.price || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">
                    Order Timeline
                  </h3>
                </div>

                <div className="p-6">
                  <div className="relative space-y-6">
                    {timelineSteps.map((step, index) => {
                      const isLast = index === timelineSteps.length - 1;
                      const isCurrent =
                        step.status === order.status ||
                        (["CANCELLED", "RETURNED", "REFUNDED"].includes(
                          step.status
                        ) &&
                          step.status === order.status);
                      const isCompleted = timelineSteps
                        .slice(0, index)
                        .some((s) => s.status === order.status);

                      return (
                        <div
                          key={step.status}
                          className="flex items-start gap-4"
                        >
                          {/* Timeline Connector */}
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                isCurrent || isCompleted
                                  ? step.bgColor
                                  : "bg-gray-100",
                                isCurrent || isCompleted
                                  ? step.borderColor
                                  : "border-gray-200",
                                "border-2"
                              )}
                            >
                              <step.icon
                                className={cn(
                                  "w-5 h-5",
                                  isCurrent || isCompleted
                                    ? step.color
                                    : "text-gray-400"
                                )}
                              />
                            </div>
                            {!isLast && (
                              <div
                                className={cn(
                                  "w-0.5 h-12 mt-2",
                                  isCompleted || isCurrent
                                    ? step.bgColor
                                    : "bg-gray-200"
                                )}
                              />
                            )}
                          </div>

                          {/* Timeline Content */}
                          <div className="flex-1">
                            <p
                              className={cn(
                                "font-medium",
                                isCurrent || isCompleted
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              )}
                            >
                              {step.label}
                            </p>
                            {/* <p
                              className={cn(
                                "text-sm",
                                isCurrent || isCompleted ? "text-gray-600" : "text-gray-400"
                              )}
                            >
                              {format(step.timestamp, "MMM dd, yyyy 'at' HH:mm")}
                            </p> */}
                            <p
                              className={cn(
                                "text-sm mt-1",
                                isCurrent || isCompleted
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              )}
                            >
                              {step.description}
                            </p>
                            {/* {(step.status === "SHIPPED" || step.status === "OUTOFDELIVERY") &&
                              (isCurrent || isCompleted) && (
                                <a
                                  href={step.trackingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                                >
                                  Track your order
                                </a>
                              )} */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Order Summary</h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MRP</span>
                    <span className="font-medium">
                      {formatter.format(
                        orderProduct.mrp || orderProduct.price || 0
                      )}
                    </span>
                  </div>
                  {orderProduct.mrp &&
                    orderProduct.price &&
                    orderProduct.mrp > orderProduct.price && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">
                          -
                          {formatter.format(
                            (orderProduct.mrp - orderProduct.price) *
                              (orderProduct.quantity || 1)
                          )}
                        </span>
                      </div>
                    )}
                  {order.discount !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span
                        className={`font-medium ${
                          (order.discount ?? 0) > 0
                            ? "text-green-600"
                            : "text-black"
                        }`}
                      >
                        {order.discount && order.discount > 0
                          ? `-${formatter.format(order.discount)}`
                          : "-₹0.00"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatter.format(
                        (orderProduct.price || 0) * (orderProduct.quantity || 1)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-gray-900">
                        {formatter.format(
                          (orderProduct.price || 0) *
                            (orderProduct.quantity || 1)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h3>
                </div>

                <div className="p-6">
                  <ShippingAddress shippingId={order.shippingId} />
                </div>
              </div>

              {["PENDING", "PROCESSING"].includes(order.status) && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      Order Actions
                    </h3>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <CancelOrderButton orderId={order.id} />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Need Help?
                  </h3>
                </div>

                <div className="p-6 space-y-3">
                  <button className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Phone className="w-4 h-4 text-[#ef9120] mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Call Support</p>
                      <p className="text-sm text-gray-600">1800-XXX-XXXX</p>
                    </div>
                  </button>

                  <button className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Mail className="w-4 h-4 text-[#ef9120] mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-600">
                        favoblis@gmail.com
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderDetailsPage;
