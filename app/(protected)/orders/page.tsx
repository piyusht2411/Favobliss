"use client";

import { OrderCard } from "@/components/order/order-card";
import { OrderCardSkeleton } from "@/components/order/order-card-skeleton";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/use-order";
import { Comment, Order, OrderProduct } from "@prisma/client";
import { Package, ShoppingBag } from "lucide-react";

const OrdersPage = () => {
  const { data, isLoading, mutate } = useOrder();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full flex justify-center">
        <div className="max-w-4xl w-full px-4 py-8 md:py-16">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-[#ef9120]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Your Orders
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and manage your recent purchases
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"></div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
              </div>
            ) : data && data.length > 0 ? (
              data.map((order) => (
                <div key={order.id} className="space-y-4">
                  <OrderCard
                    key={order.orderProduct[0].id}
                    data={{
                      ...order.orderProduct[0],
                      color: order.orderProduct[0].color ?? "",
                    }}
                    date={order.createdAt}
                    paid={order.isPaid}
                    status={order.status}
                    orderNumber={order.orderNumber}
                    estimatedDeliveryDays={order.estimatedDeliveryDays}
                    orderId={order.id}
                    backendOrderId={order.backendOrderId || ""}
                    onCancel={() => mutate()}
                    mrp={order.mrp}
                    price={order.price}
                    paymentMethod={order.paymentMethod}
                    noOfProducts={order.orderProduct.length}
                  />
                  {/* ) */}
                  {/* )
                  } */}
                </div>
              ))
            ) : (
              // Empty State
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  When you place your first order, it will appear here. Start
                  shopping to see your order history!
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-[#ef9120] text-black font-medium rounded-lg hover:bg-[#ef9120] transition-colors">
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Stats Footer (Optional) */}
          {/* {data && data.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                Showing{" "}
                {data.reduce(
                  (acc, order) => acc + order.orderProduct.length,
                  0
                )}{" "}
                items from {data.length} order{data.length !== 1 ? "s" : ""}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
