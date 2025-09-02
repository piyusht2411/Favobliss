"use client";
// import { Product } from "@/types";
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
import { Product, Variant } from "@/types";

interface ProductDescriptionProps {
  data: Variant;
}

export const ProductDescription = ({ data }: ProductDescriptionProps) => {
  const { addItem } = useCart();

  // const onHandleCart = async () => {
  //   const selectedVariant =
  //     data.variants && data.variants.length > 0 ? data.variants[0] : undefined;
  //   if (!selectedVariant) {
  //     return;
  //   }
  //   addItem({ ...data, checkOutQuantity: 1, selectedVariant });
  // };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-full mx-auto flex flex-col space-y-8">
          {/* Product Details */}
          <div className="space-y-2">
            {/* <h4 className="font-semibold text-black text-2xl">
              Product Details
            </h4> */}
            <div
              className="text-zinc-600 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>

          {/* Size & Fit */}
          {/* {data.sizeAndFit.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-black text-lg md:text-xl">
                Size & Fit
              </h4>
              {data.sizeAndFit.map((item, index) => (
                <p key={index} className="text-zinc-600">
                  {item}
                </p>
              ))}
            </div>
          )} */}

          {/* Material & Care */}
          {/* {data.materialAndCare.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-black text-lg md:text-xl">
                Material & Care
              </h4>
              {data.materialAndCare.map((item, index) => (
                <p key={index} className="text-zinc-600">
                  {item}
                </p>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};
