"use client";

import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useCheckout } from "@/hooks/use-checkout";
import { useCheckoutAddress } from "@/hooks/use-checkout-address";
import { usePaymentSuccessErrorModal } from "@/hooks/use-payment-success-error-modal";
import { useCart } from "@/hooks/use-cart";
import { getCoupons } from "@/actions/get-coupons";
import { Coupons } from "@/types";

interface Props {
  isAddressCorrect?: boolean;
}

export const Summary = (props: Props) => {
  const { isAddressCorrect = true } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = useSession();
  const { address } = useCheckoutAddress();
  const { removeAll } = useCart();

  const { checkOutItems, clearCheckOutItems } = useCheckout();
  const { onOpen } = usePaymentSuccessErrorModal();
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<Coupons[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupons | null>(null);
  const [discount, setDiscount] = useState(0);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  console.log(coupons, "coupons");
  console.log(checkOutItems, "checkOutItems");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const fetchedCoupons = await getCoupons();
        setCoupons(fetchedCoupons);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        toast.error("Failed to load coupons");
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchCoupons();
  }, []);

  const getTotalAmount = () => {
    const amount = checkOutItems.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
    return amount;
  };

  const applyCoupon = () => {
    const coupon = coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }
    if (!coupon.isActive) {
      toast.error("Coupon is not active");
      return;
    }
    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    if (currentDate > expiryDate) {
      toast.error("Coupon has expired");
      return;
    }
    if (
      coupon.products &&
      coupon.products.length > 0 &&
      coupon.products[0].id
    ) {
      const cartProductIds = checkOutItems.map((item) => item?.id);
      const couponProductIds = coupon.products.map((p) => p.productId);
      const isMatch = couponProductIds.some((id) =>
        cartProductIds.includes(id)
      );
      if (!isMatch) {
        toast.error("Coupon does not apply to the products in your cart");
        return;
      }
    }
    setAppliedCoupon(coupon);
    setDiscount(coupon.value);
    toast.success("Coupon applied successfully");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const updateOrder = async (id: string) => {
    try {
      await axios.patch(`/api/v1/order/${id}`, { isPaid: true });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchParams.get("id")) {
      const orderId = searchParams.get("id");
      updateOrder(orderId!).then(() => {
        onOpen("success");
        removeAll();
        clearCheckOutItems();
        router.push("/orders");
      });
    }

    if (searchParams.get("cancelled")) {
      onOpen("error");
    }
  }, [searchParams, onOpen, removeAll, clearCheckOutItems, router]);

  const onCheckOut = async () => {
    try {
      if (session.status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (pathname.includes("/checkout/cart")) {
        router.push("/checkout/address");
        return;
      }

      if (!address) {
        toast.error("Please provide a shipping address");
        return;
      }

      setLoading(true);
      const order = await axios.post(`/api/v1/order`, {
        products: checkOutItems.map((item) => ({
          id: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          size: item.size || "",
          color: item.color || "",
          image: item.image,
          name: item.name,
          about: JSON.stringify({
            variantId: item.variantId,
            color: item.color,
            price: item.price,
            locationId: item.locationId,
          }),
        })),
        address,
      });

      const orderId = order.data.orderId;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          products: checkOutItems.map((item) => ({
            id: item.variantId,
            quantity: item.quantity,
            price: item.price,
            locationId: item.locationId,
          })),
          orderId: orderId,
        }
      );

      const { orderId: razorpayOrderId, amount, currency, key } = response.data;

      const addressForNotes = {
        address: String(address.address || ""),
        landmark: String(address.landmark || ""),
        town: String(address.town || ""),
        district: String(address.district || ""),
        state: String(address.state || ""),
        zipCode: String(address.zipCode || ""),
      };

      let addressJsonString;
      try {
        addressJsonString = JSON.stringify(addressForNotes);
        JSON.parse(addressJsonString);
      } catch (error) {
        console.error("Failed to stringify address:", error);
        throw new Error("Invalid address format");
      }

      const options = {
        key,
        amount,
        currency,
        name: "Favobliss",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: function (response: any) {
          router.push(`/checkout/cart?id=${orderId}`);
        },
        prefill: {
          name: address.name || "",
          email: session.data?.user?.email || "",
          contact: address.phoneNumber || "",
        },
        notes: {
          orderId,
          address: addressJsonString,
        },
        theme: {
          color: "#3399cc",
        },
      };

      //@ts-ignore
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        router.push(`/checkout/cart?cancelled=true`);
      });
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-6">
      <h2 className="text-lg md:text-xl font-bold text-zinc-800">
        Order Summary
      </h2>
      <div className="mt-6 space-y-4 border-t">
        {/* Improved Coupon UI */}
        {!appliedCoupon ? (
          <div className="relative flex items-stretch overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-100 transition-all duration-200">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 bg-transparent border-0 outline-none text-sm font-medium tracking-wide uppercase"
            />
            <Button
              onClick={applyCoupon}
              disabled={loadingCoupons || !couponCode}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 border-0 ${
                loadingCoupons || !couponCode
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 hover:shadow-md active:scale-95"
              }`}
            >
              {loadingCoupons ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading</span>
                </div>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Coupon Applied: {appliedCoupon.code}
                </p>
                <p className="text-xs text-green-600">
                  You saved {formatter.format(discount)}
                </p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <p className="text-zinc-600 text-base font-semibold mt-2">
          PRICE DETAILS ( {checkOutItems.length} Item )
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-zinc-500">Total MRP</p>
            <p className="text-base font-medium text-zinc-500">
              {formatter.format(getTotalAmount())}
            </p>
          </div>
          {appliedCoupon && (
            <div className="flex items-center justify-between">
              <p className="text-base font-medium text-zinc-500">
                Your Savings Estimated
              </p>
              <p className="text-base font-medium text-green-600">
                -{formatter.format(discount)}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-zinc-500">
              Shipping Charges
            </p>
            <p className="text-base font-medium text-emerald-500">FREE</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-zinc-800">Total Amount</p>
          <p className="text-base font-bold text-zinc-800">
            {formatter.format(getTotalAmount() - discount)}
          </p>
        </div>
      </div>
      <Button
        size="lg"
        disabled={loading || !isAddressCorrect}
        className="font-semibold mt-6 w-full"
        onClick={onCheckOut}
      >
        {pathname === "/checkout/cart" ? "CONTINUE" : "PLACE ORDER"}
      </Button>
    </div>
  );
};
