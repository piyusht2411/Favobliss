"use client";

import { HiOutlineShoppingBag } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Product, Wishlist } from "@prisma/client";
import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { Account } from "./account";
import { Skeleton } from "@/components/ui/skeleton";

interface NavbarActionsProps {
  wishlistItems:
    | (Wishlist & {
        products: Product[];
      })
    | null;
}

export const NavbarActions = ({ wishlistItems }: NavbarActionsProps) => {
  const router = useRouter();
  const { items } = useCart();
  const { createWishlist } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (wishlistItems) {
      const wishlistProductIds = wishlistItems.products.map(
        (product) => product.productId
      );
      createWishlist(wishlistProductIds);
    }
  }, [wishlistItems]);

  if (!isMounted) {
    return (
      <div className="ml-auto flex items-center gap-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Button variant="outline" size="icon" disabled>
          <Heart className="text-zinc-300 h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" disabled>
          <HiOutlineShoppingBag className="text-zinc-300 h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-x-2">
      <Account />
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="border-none"
        onClick={() => router.push("/wishlist")}
      >
        <Heart className="text-zinc-700 h-6 w-6" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="relative group border-none"
        onClick={() => router.push("/checkout/cart")}
      >
        <HiOutlineShoppingBag className="text-zinc-700 h-6 w-6" />
        <Badge className="absolute z-10 -right-2 -top-2 text-xs p-[4px] px-[7px] bg-zinc-700 group-hover:bg-zinc-600">
          {items.length}
        </Badge>
      </Button>
    </div>
  );
};
