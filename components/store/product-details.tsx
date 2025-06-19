"use client";
import { Product } from "@/types";
import { formatter } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { HiShoppingBag } from "react-icons/hi";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { WishlistButton } from "./wishlist-button";
import BankOffers from "./bankOffer";
import DeliveryInfo from "./delieveryInfo";
import KeyFeatures from "./keyFeatures";
import ZipCarePlan from "./zipCarePlan";
import { ProductFeatures } from "./productFeature";

interface ProductDetailsProps {
  data: Product;
}

export const ProductDetails = ({ data }: ProductDetailsProps) => {
  const { addItem } = useCart();

  const onHandleCart = async () => {
    addItem({ ...data, checkOutQuantity: 1 });
  };

  return (
    <div className="text-black bg-white">
      {/* Add the Header at the top */}

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 pb-3 md:py-6 ">
        <h1 className="text-2xl md:text-xl font-bold">{data.name}</h1>
        <p className="text-[#088466] mt-2">
          4.1 ⭐ <span className="underline">(9 ratings & 4 Reviews)</span>
        </p>
        <button
          className="
                    my-4 w-[159.88px] h-[32px] bg-[#CFFFF3] rounded-[82px] font-bold font-inter text-[11.25px]
                "
        >
          <p className="text-[#088466]">Rs 3750 Bank Discount</p>
        </button>

        {/* Price Section */}
        <div className="p-4 rounded-md max-w-md">
          <div className="flex items-center justify-between flex-wrap gap-3 md:gap-0">
            <div>
              <p className="text-3xl font-semibold">
                {formatter.format(data.price)}
              </p>
              <p className="text-sm text-gray-500">(Incl. all Taxes)</p>
            </div>
            <div className="flex items-center gap-8 md:gap-14">
              <div className="border border-black px-3 py-1 rounded">OR</div>
              <div>
                <p className="text-xl font-semibold">
                  ₹1,318/mo<sup>*</sup>
                </p>
                <a href="#" className="text-green-600 text-sm underline">
                  EMI Options
                </a>
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="line-through text-gray-500 mr-2">
              MRP: ₹61,990.00
            </span>
            <span className="text-black">(Save ₹34,000, 54.85% off)</span>
          </div>
        </div>

        <ProductFeatures data={data} />

        {/* Exchange Options */}
        {/* <div className="border border-[#808080] h-[164px] my-4 rounded-sm">
          <label className="flex items-start gap-3 p-4 border rounded-t-md border-gray-600">
            <input
              type="radio"
              name="exchange"
              className="mt-1 accent-gray-400"
              disabled
            />
            <div>
              <div className="font-medium">With Exchange</div>
              <div className="text-red-500">
                Unfortunately not available for your location
              </div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4">
            <input
              type="radio"
              name="exchange"
              className="accent-green-500"
              checked
            />
            <span className="font-medium">Without Exchange</span>
          </label>
        </div> */}

        {/* Screen Size */}
        {/* <div className="flex flex-col justify-start gap-y-2 gap-x-4 mt-8">
          <h4 className="font-semibold text-black md:text-base">
            Screen Size in Inches
          </h4>
          <div className="flex items-center bg-gray-100 justify-center h-8 max-w-20 px-2 py-1 rounded-md border border-green-500 text-lg font-semibold text-black hover:text-black transition-colors cursor-default">
            {data.size.value}
          </div>
        </div> */}

        {/* Bank Offers, Delivery Info, Key Features, ZipCare Plan */}
        <div>
          <BankOffers />
        </div>
        <div className="max-w-4xl mx-auto py-4 mt-5">
          <DeliveryInfo />
          <KeyFeatures />
        </div>
        {/* <div className="py-6">
          <ZipCarePlan />
        </div> */}

        {/* Add to Cart and Wishlist */}
        <div className="mt-8 grid grid-cols-2 max-w-sm gap-x-4">
          <Button className="w-full h-14 font-bold" onClick={onHandleCart}>
            <HiShoppingBag className="mr-4 h-6 w-6" />
            ADD TO BAG
          </Button>
          <WishlistButton productId={data.id} />
        </div>

        {/* <Separator className="my-8" /> */}

        {/* Product Details, Size & Fit, Material & Care */}
        {/* <div className="max-w-md flex flex-col space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-black md:text-xl">
              Product Details
            </h4>
            <div
              className="text-gray-600 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>
          {data.sizeAndFit.length !== 0 && (
            <div>
              <h4 className="font-semibold text-black md:text-xl mb-2">
                Size & Fit
              </h4>
              {data.sizeAndFit.map((item, index) => (
                <p key={index} className="text-gray-600">
                  {item}
                </p>
              ))}
            </div>
          )}
          {data.materialAndCare.length !== 0 && (
            <div>
              <h4 className="font-semibold text-black md:text-xl mb-2">
                Material & Care
              </h4>
              {data.materialAndCare.map((item, index) => (
                <p key={index} className="text-gray-600">
                  {item}
                </p>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
