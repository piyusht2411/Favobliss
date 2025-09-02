import { getCategories } from "@/actions/get-categories";
import Header from "./store/header";
import HeaderMobile from "./store/HeaderMobile";
import { SkeletonHeader } from "./SkeletonHeader";
import { SkeletonHeaderMobile } from "./SkeletonHeaderMobile";

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

  return (
    <header className="shadow-neutral-100 shadow-lg p-[15px] md:p-0">
      <HeaderMobile categories={data} />
      <Header categories={data} />
    </header>
  );
};
