import Link from "next/link";
import { Pacifico } from "next/font/google";

import { Container } from "@/components/ui/container";
import { MainNav } from "./main-nav";
import { getCategories } from "@/actions/get-categories";
import { NavbarActions } from "./navbar-actions";
import { cn } from "@/lib/utils";
import { getWishlistItems } from "@/actions/get-whishlist";
import { MobileNavbar } from "./mobile-nav";
import Header from "./store/header";
import useMediaQuery from "@/hooks/use-mediaquery";
import HeaderMobile from "./store/HeaderMobile";
import { SkeletonHeader } from "./SkeletonHeader";
import { SkeletonHeaderMobile } from "./SkeletonHeaderMobile";

// const font = Pacifico({
//   weight: ["400"],
//   subsets: ["latin"],
// });

export const Navbar = async () => {
  const storeId =
    process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";
  if (!storeId) {
    console.error("Store ID is not defined", {
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    });
    return (
      <>
        <SkeletonHeader />
        <SkeletonHeaderMobile />
      </>
    );
  }
  const data = await getCategories(storeId);
  // const wishlistItems = await getWishlistItems();

  return (
    <header className="shadow-neutral-100 shadow-lg p-[15px] md:p-0">
      <HeaderMobile categories={data} />
      <Header categories={data} />
    </header>
  );
};
