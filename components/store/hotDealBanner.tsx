import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HotDealBanner = () => {
  return (
    <div className="w-full grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
      <div className="w-full aspect-[2/.9] bg-gradient-to-r from-[#C5A090] to-85% to-[#EEE3DF] rounded-lg md:rounded-xl grid grid-cols-5">
        <div className="col-span-2 flex items-center">
          <div className="flex flex-col pl-4 sm:pl-12">
            <p className="text-white font-semibold">Hot Deal</p>
            <p className="font-bold text-xl sm:text-3xl md:text-4xl text-white">
              Air Conditioners
            </p>
            <Button
              className="bg-white mt-4 text-zinc-800 font-semibold sm:text-base hover:bg-zinc-50 transition"
              size="lg"
              asChild
            >
              <Link href="/category/air-conditioners?page=1">View Offers</Link>
            </Button>
          </div>
        </div>
        <div className="p-4 relative col-span-3">
          <Image
            src="/assets/ac.png"
            alt="Image"
            fill
            className="object-contain bg-blend-color-burn"
          />
        </div>
      </div>
      <div className="w-full aspect-[2/.9] bg-gradient-to-r from-blue-400 to-85% to-sky-600 rounded-lg md:rounded-xl grid grid-cols-5">
        <div className="col-span-2 flex items-center">
          <div className="flex flex-col pl-4 sm:pl-12">
            <p className="text-white font-semibold">Hot Deal</p>
            <p className="font-bold text-xl sm:text-3xl md:text-4xl text-white">
              Apple Iphone
            </p>
            <Button
              className="bg-white mt-4 text-rose-400 font-semibold sm:text-base hover:bg-zinc-50 transition"
              size="lg"
              asChild
            >
              <Link href="/product/apple-iphone-13-512gb-mlqg3hna-blue">
                Shop Now
              </Link>
            </Button>
          </div>
        </div>
        <div className="p-4 relative col-span-3">
          <Image
            src="/assets/iphone.png"
            alt="Image"
            fill
            className="object-contain bg-blend-color-burn"
          />
        </div>
      </div>
    </div>
  );
};
