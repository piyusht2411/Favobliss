"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export const HotDealBanner = () => {
  const route = useRouter();

  const handleNavigation = (link: string) => {
    route.push(`/${link}`);
  };

  return (
    <div className="w-full">
      <div className="hidden lg:flex items-center gap-6 max-w-full mx-auto">
        <div
          className="flex-1 aspect-[2/0.9] bg-gradient-to-r from-[#C5A090] to-85% to-[#EEE3DF] rounded-xl overflow-hidden relative cursor-pointer"
          onClick={() => handleNavigation("category/air-conditioners?page=1")}
        >
          <Image
            src="/assets/banner-ac.png"
            alt="Air Conditioner Banner"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex-1 aspect-[2/0.9] bg-gradient-to-r from-blue-400 to-85% to-sky-600 rounded-xl overflow-hidden relative cursor-pointer"
         onClick={() => handleNavigation("category/mobile?page=1")}>
          <Image
            src="/assets/banner-mobile.png"
            alt="iPhone Banner"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div
        className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4"
        role="region"
        aria-label="Hot deal banners carousel"
      >
        <div className="w-[80vw] aspect-[2/0.9] bg-gradient-to-r from-[#C5A090] to-85% to-[#EEE3DF] rounded-lg overflow-hidden flex-shrink-0 snap-start relative cursor-pointer"
        onClick={() => handleNavigation("category/air-conditioners?page=1")}>
          <Image
            src="/assets/banner-ac.png"
            alt="Air Conditioner Banner"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
        <div className="w-[80vw] aspect-[2/0.9] bg-gradient-to-r from-blue-400 to-85% to-sky-600 rounded-lg overflow-hidden flex-shrink-0 snap-start relative cursor-pointer"
        onClick={() => handleNavigation("category/mobile?page=1")}>
          <Image
            src="/assets/banner-mobile.png"
            alt="iPhone Banner"
            fill
            className="object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
