"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Heart, LogOut, ShoppingCart, User } from "lucide-react";
import { MdLogin, MdPersonAdd } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const Account = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigation = (path: string) => {
    // Close dropdown first
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    setTimeout(() => router.push(path), 100);
  };

  if (!isMounted || status === "loading") {
    return (
      <div className="h-6 w-6 mx-2">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
    );
  }

  const isAuthenticated = status === "authenticated";
  const userName = isAuthenticated ? session?.user?.name || "User" : "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <FaRegUser className="h-6 w-6 mx-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="end">
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <>
            <DropdownMenuItem
              className="flex items-center text-zinc-700 font-semibold md:cursor-pointer"
              onClick={() => router.push("/my/dashboard")}
            >
              <User className="mr-3 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center text-zinc-700 font-semibold md:cursor-pointer"
              onClick={() => router.push("/orders")}
            >
              <ShoppingCart className="mr-3 h-4 w-4" />
              Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center text-zinc-700 font-semibold md:cursor-pointer"
              onClick={() => router.push("/wishlist")}
            >
              <Heart className="mr-3 h-4 w-4" />
              Wishlist
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center text-zinc-700 font-semibold md:cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              className="flex items-center text-zinc-700 font-semibold md:cursor-pointer"
              onClick={() => handleNavigation("/login")}
            >
              <MdLogin className="mr-3 h-4 w-4" />
              Sign In
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center text-zinc-700 font-semibold md:cursor-pointer"
              onClick={() => handleNavigation("/registration")}
            >
              <MdPersonAdd className="mr-3 h-4 w-4" />
              Sign Up
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
