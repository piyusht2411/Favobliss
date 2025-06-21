"use client";

import useMediaQuery from "@/hooks/use-mediaquery";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function SkeletonHeaderMobile() {
  const isMobile = useMediaQuery("(max-width: 1000px)");
  if (!isMobile) {
    return null;
  }

  return (
    <header className="bg-black text-white py-4 px-4 shadow-md">
      {/* Top Row: Menu Icon, Logo, Profile, Cart */}
      <div className="flex items-center justify-between">
        {/* Left: Menu Icon and Logo */}
        <div className="flex items-center space-x-4">
          <Skeleton
            width={24}
            height={24}
            baseColor="#333"
            highlightColor="#444"
          />
          <Skeleton
            width={120}
            height={40}
            baseColor="#333"
            highlightColor="#444"
          />
        </div>

        {/* Right: Profile, Cart */}
        <div className="flex items-start space-x-4">
          {/* Profile */}
          <Skeleton
            circle
            width={24}
            height={24}
            baseColor="#333"
            highlightColor="#444"
          />
          {/* Cart */}
          <div className="relative">
            <Skeleton
              width={24}
              height={24}
              baseColor="#333"
              highlightColor="#444"
            />
            <Skeleton
              circle
              width={20}
              height={20}
              baseColor="#ef4444"
              highlightColor="#f87171"
              className="absolute -top-2 -right-2"
            />
          </div>
        </div>
      </div>

      {/* Search Bar with Dropdown */}
      <div className="mt-4 relative">
        <div className="flex bg-white overflow-hidden rounded-[6px]">
          {/* Category Dropdown Button */}
          <Skeleton
            width={100}
            height={40}
            baseColor="#e6e6e6"
            highlightColor="#f5f5f5"
          />
          {/* Search Input */}
          <Skeleton
            width={200}
            height={40}
            baseColor="#e6e6e6"
            highlightColor="#f5f5f5"
          />
        </div>
      </div>
    </header>
  );
}
