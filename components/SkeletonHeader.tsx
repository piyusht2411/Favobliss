"use client";

import useMediaQuery from "@/hooks/use-mediaquery";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function SkeletonHeader() {
  const isMobile = useMediaQuery("(max-width: 1000px)");
  if (isMobile) {
    return null;
  }
  return (
    <div className="bg-black">
      <div className="max-w-[1400px] m-auto pb-5">
        <header className="bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
          {/* Logo Placeholder */}
          <div className="flex items-center space-x-4">
            <Skeleton
              width={200}
              height={60}
              baseColor="#333"
              highlightColor="#444"
            />
          </div>

          {/* Search Bar Placeholder */}
          <div className="flex-1 mx-6 max-w-2xl relative">
            <div className="flex bg-white rounded-md overflow-hidden">
              <Skeleton
                width={120}
                height={40}
                baseColor="#e6e6e6"
                highlightColor="#f5f5f5"
              />
              <Skeleton
                width={400}
                height={40}
                baseColor="#e6e6e6"
                highlightColor="#f5f5f5"
              />
            </div>
          </div>

          {/* Account, Location, Cart Placeholder */}
          <div className="flex items-center space-x-6">
            {/* Account */}
            <Skeleton
              circle
              width={32}
              height={32}
              baseColor="#333"
              highlightColor="#444"
            />
            {/* Location */}
            <div className="hidden md:flex items-center space-x-1">
              <Skeleton
                width={24}
                height={24}
                baseColor="#333"
                highlightColor="#444"
              />
              <Skeleton
                width={80}
                height={16}
                baseColor="#333"
                highlightColor="#444"
              />
            </div>
            {/* Cart */}
            <div className="flex items-center gap-2">
              <Skeleton
                width={80}
                height={16}
                baseColor="#333"
                highlightColor="#444"
              />
              <Skeleton
                width={24}
                height={24}
                baseColor="#333"
                highlightColor="#444"
              />
            </div>
          </div>
        </header>

        {/* Navigation Menu Placeholder */}
        <nav className="bg-black text-white py-2 px-6 flex justify-between items-center shadow-md flex-wrap gap-2 gap-y-5 max-w-7xl mx-auto">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                width={100}
                height={20}
                baseColor="#333"
                highlightColor="#444"
              />
            ))}
        </nav>
      </div>
    </div>
  );
}
