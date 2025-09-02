"use client";

import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { EmptyCart } from "@/components/cart/empty-cart";
import { Container } from "@/components/ui/container";
import { CartItem } from "@/components/cart/cart-item";
import { Summary } from "@/components/cart/summary";
import { Hero } from "@/components/cart/hero";
import { useEffect } from "react";
import { useCheckout } from "@/hooks/use-checkout";
import { PincodeValidator } from "@/components/store/PincodeValidator";

const CartPage = () => {
  const { items } = useCart();
  const { setCheckOutItems } = useCheckout();

  useEffect(() => {
    const checkoutItems = items.map((item) => ({
      id: item.id,
      variantId: item.selectedVariant.id,
      price: item.price,
      mrp: item.mrp, // Added
      quantity: item.checkOutQuantity,
      image: item.selectedVariant.images[0]?.url || "",
      about: item.selectedVariant.about || "",
      name: item.selectedVariant.name,
      size: item.selectedVariant.size?.value,
      color: item.selectedVariant.color?.name,
      selectedVariant: item.selectedVariant,
      slug: item.slug,
    }));
    setCheckOutItems(checkoutItems);
  }, [items, setCheckOutItems]);

  return (
    <div
      className={cn("bg-white min-h-full", items.length === 0 && "h-[90vh]")}
    >
      {items.length === 0 && <EmptyCart />}
      {items.length !== 0 && (
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 xl:px-24 h-full">
            {/* <PincodeValidator /> */}
            <div className="my-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
              <div className="lg:col-span-7">
                <ul className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.selectedVariant.id}
                      data={item}
                      deliveryDays={item.deliveryDays}
                    />
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-y-8 w-full lg:col-span-5 lg:mt-0 mt-16">
                <Summary />
                <Hero />
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default CartPage;
