import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const LatestLaunches = () => {
  return (
    <Container>
      <div className="py-8">
        <h3 className="text-3xl font-bold">Amazing Offers</h3>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 my-4 gap-6 md:gap-8 lg:gap-10">
        <div className="w-full aspect-[2/.9] bg-gradient-to-r from-[#C5A090] to-85% to-[#EEE3DF] rounded-lg md:rounded-xl ">
          <img
            src="/assets/latestLaunch.webp"
            alt="Image"
            className="w-full h-full bg-blend-color-burn rounded-xl shadow-xl"
          />
        </div>
        <div className="w-full aspect-[2/.9] bg-gradient-to-r from-[#C5A090] to-85% to-[#EEE3DF] rounded-lg md:rounded-xl ">
          <img
            src="/assets/macbookBanner.webp"
            alt="Image"
            className="w-full h-full  bg-blend-color-burn rounded-xl shadow-xl"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 my-4 gap-6 md:gap-8 lg:gap-10">
        <div className="w-full aspect-[2/.9] bg-gradient-to-r from-[#C5A090] to-85% to-[#EEE3DF] rounded-lg md:rounded-xl ">
          <img
            src="/assets/macbookBanner.webp"
            alt="Image"
            className="w-full h-full bg-blend-color-burn rounded-xl shadow-xl"
          />
        </div>
        <div className="w-full aspect-[2/.9] bg-gradient-to-r from-[#C5A090] to-85% to-[#EEE3DF] rounded-lg md:rounded-xl ">
          <img
            src="/assets/latestLaunch.webp"
            alt="Image"
            className="w-full h-full  bg-blend-color-burn rounded-xl shadow-xl"
          />
        </div>
      </div>
    </Container>
  );
};
