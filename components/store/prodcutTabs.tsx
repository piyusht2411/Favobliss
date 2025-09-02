"use client";

import { useState, useRef } from "react";
import { Product, Variant } from "@/types";
import { ProductDescription } from "@/components/store/productDescription";
import { Button } from "@/components/ui/button";

interface ProductTabsProps {
  productData: {
    variant: Variant;
    product: Product;
    allVariants: {
      id: string;
      title: string;
      slug: string;
      color: string | null;
      size: string | null;
    }[];
  };
  productId: string;
}

export const ProductTabs = ({ productData, productId }: ProductTabsProps) => {
  const { variant, product } = productData;
  const [showMore, setShowMore] = useState({
    description: false,
    specification: false,
    return: false,
    review: false,
  });

  const descriptionRef = useRef<HTMLDivElement>(null);
  const specificationRef = useRef<HTMLDivElement>(null);
  const returnRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const returnData = [
    "In the refund or replacement or exchange process there is a complete chain to sort out the issues from the side of the customer.",
    `After receiving the product from FAVOBLISS through delivery boy, customer receives product and raises query for refund or replacement or exchange. Again, a particular process is followed so kindly record an unboxing video as per the company policies and mail that video at support@favobliss.com. `,
    `Log in to Favobliss and go to your Orders tab. Tap or click on Return to create a request.`,
    `Select your applicable reason of return — based on which the option of an exchange, where applicable, will appear. Three options will be available:`,
    `Exchange: Your order will be exchanged for a new identical product of a different size or color.`,
    `Replace: The product in your order will be replaced with an identical product in case it is damaged (broken or spoiled) or defective (has a functional problem that causes it not to work).`,
    `Refund: If the product of your choice is unavailable in your preferred size, color or model, or if it is out of stock, you may decide that you want your money back. In this scenario, you may choose a Refund to have your money returned to you. Depending on the kind of product you wish to return, your request may have to undergo a verification process. Following verification, you will be required to confirm your decision based on the category of the product ordered.`,
    `Keep ready all the requisite items necessary for a smooth returns process — including invoice, original packaging, price tags, freebies, accessories, etc.`,
    `Kindly unbox your product safely so that you don't damage your product's packaging. Otherwise, your refund or replacement request will not be accepted. If you received a broken or mismatched product, kindly mail us within 24 hrs of your delivery date with video clips and images.`,
    `If you have received a damaged or defective product or if it is not as described or is a mismatched product, you can raise a replacement request on the Website/App/Mobile site within 5 days of receiving the product. In case you have ordered a TV or Mobile, our delivery executive will assist with onsite unboxing.`,
    `Pickup and Delivery of your order will be scheduled hand-in-hand in case of exchanges and replacements. Refund will be initiated and processed if applicable after the pickup has been done within 5–7 working days.`,
    `Your request will be fulfilled according to Favobliss's returns/replacement guarantee.`,
  ];

  const groupedSpecifications = variant.variantSpecifications.reduce(
    (acc, spec) => {
      const groupName = spec.specificationField.group?.name || "Uncategorized";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push({
        name: spec.specificationField.name,
        value: spec.value,
      });
      return acc;
    },
    {} as Record<string, { name: string; value: string }[]>
  );

  const sortedGroupNames = Object.keys(groupedSpecifications).sort((a, b) => {
    if (a.toUpperCase() === "GENERAL") return -1;
    if (b.toUpperCase() === "GENERAL") return 1;
    return a.localeCompare(b);
  });

  const descriptionLineEstimate =
    variant.description.length / 100 +
    product.sizeAndFit.length +
    product.materialAndCare.length;
  const isDescriptionLong = descriptionLineEstimate > 8;

  const totalSpecFields = sortedGroupNames.reduce(
    (sum, groupName) => sum + groupedSpecifications[groupName].length,
    0
  );
  const isSpecificationLong = totalSpecFields > 15;

  const isReturnLong = returnData.length > 8;

  const toggleShowMore = (section: keyof typeof showMore) => {
    const refs = {
      description: descriptionRef,
      specification: specificationRef,
      return: returnRef,
      review: reviewRef,
    };

    const currentRef = refs[section];
    const currentScrollY = window.scrollY;

    setShowMore((prev) => {
      const newState = { ...prev, [section]: !prev[section] };

      if (!newState[section] && currentRef?.current) {
        setTimeout(() => {
          const elementTop =
            currentRef.current!.getBoundingClientRect().top + window.scrollY;
          const offset = 100;
          window.scrollTo({
            top: Math.max(0, elementTop - offset),
            behavior: "smooth",
          });
        }, 150);
      }

      return newState;
    });
  };

  const ShowMoreButton = ({
    section,
    isExpanded,
    isLong,
  }: {
    section: keyof typeof showMore;
    isExpanded: boolean;
    isLong: boolean;
  }) => {
    if (!isLong) return null;

    return (
      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="sm"
          className="group relative overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300 hover:from-orange-100 hover:to-amber-100 text-orange-700 hover:text-orange-800 font-medium px-6 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
          onClick={() => toggleShowMore(section)}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-sm">
              {isExpanded ? "Show Less" : "Show More"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-6">
      {/* Product Description */}
      <div className="py-4" ref={descriptionRef}>
        <h2 className="font-semibold text-black text-lg md:text-xl mb-4">
          Product Description
        </h2>
        <div
          className={`transition-all duration-500 ease-in-out ${
            isDescriptionLong && !showMore.description
              ? "max-h-32 overflow-hidden"
              : "max-h-none"
          }`}
          style={{
            maskImage:
              isDescriptionLong && !showMore.description
                ? "linear-gradient(to bottom, black 60%, transparent 100%)"
                : "none",
            WebkitMaskImage:
              isDescriptionLong && !showMore.description
                ? "linear-gradient(to bottom, black 60%, transparent 100%)"
                : "none",
          }}
        >
          <ProductDescription data={variant} />
        </div>
        <ShowMoreButton
          section="description"
          isExpanded={showMore.description}
          isLong={isDescriptionLong}
        />
      </div>

      {/* Specification */}
      <div className="py-4" ref={specificationRef}>
        <h2 className="font-semibold text-black text-lg md:text-xl mb-4">
          Specification
        </h2>
        <div
          className={`transition-all duration-500 ease-in-out w-full px-4 sm:px-6 lg:px-8 py-4 ${
            isSpecificationLong && !showMore.specification
              ? "max-h-32 overflow-hidden"
              : "max-h-none"
          }`}
          style={{
            maskImage:
              isSpecificationLong && !showMore.specification
                ? "linear-gradient(to bottom, black 60%, transparent 100%)"
                : "none",
            WebkitMaskImage:
              isSpecificationLong && !showMore.specification
                ? "linear-gradient(to bottom, black 60%, transparent 100%)"
                : "none",
          }}
        >
          <div className="max-w-none">
            <div className="space-y-0 border overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-x-[50px] gap-y-[50px] border-transparent">
              {sortedGroupNames.map((groupName) => (
                <div
                  key={groupName}
                  className="border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                      {groupName}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {groupedSpecifications[groupName].map(
                      (field: any, index: number) => (
                        <div key={index} className="flex px-4 py-3">
                          <div className="w-1/3 font-medium text-gray-700">
                            {field.name}
                          </div>
                          <div className="w-2/3 text-gray-600">
                            {field.value}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
              {sortedGroupNames.length === 0 && (
                <div className="px-4 py-3 text-gray-600">
                  No specifications available.
                </div>
              )}
            </div>
          </div>
        </div>
        <ShowMoreButton
          section="specification"
          isExpanded={showMore.specification}
          isLong={isSpecificationLong}
        />
      </div>

      {/* Return and Refund Policy */}
      <div className="py-4" ref={returnRef}>
        <h2 className="font-semibold text-black text-lg md:text-xl mb-4">
          Return and Refund Policy
        </h2>
        <div
          className={`transition-all duration-500 ease-in-out ${
            isReturnLong && !showMore.return
              ? "max-h-32 overflow-hidden"
              : "max-h-none"
          }`}
          style={{
            maskImage:
              isReturnLong && !showMore.return
                ? "linear-gradient(to bottom, black 60%, transparent 100%)"
                : "none",
            WebkitMaskImage:
              isReturnLong && !showMore.return
                ? "linear-gradient(to bottom, black 60%, transparent 100%)"
                : "none",
          }}
        >
          <div className="prose max-w-none sm:px-6 lg:px-8 py-2">
            <ul className="list-disc pl-5 space-y-2">
              {returnData.map((text, index) => (
                <li key={index} className="text-gray-700 text-base">
                  {text}
                  {index === 1 && (
                    <span className="text-red-500">
                      The maximum number of days for a refund or replacement or
                      exchange process is 10 days.*
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ShowMoreButton
          section="return"
          isExpanded={showMore.return}
          isLong={isReturnLong}
        />
      </div>

      {/* Review */}
      {/* <div className="py-4" ref={reviewsRef}>
        <div
          className={`transition-all duration-500 ease-in-out ${
            showMore.review ? "max-h-none" : "max-h-32 overflow-hidden"
          }`}
          style={{
            maskImage: !showMore.review
              ? "linear-gradient(to bottom, black 60%, transparent 100%)"
              : "none",
            WebkitMaskImage: !showMore.review
              ? "linear-gradient(to bottom, black 60%, transparent 100%)"
              : "none",
          }}
        >
          <ProductReviews
            productId={productId}
            totalReviews={totalReviews}
            avgRating={avgRating}
            setAvgRating={setAvgRating}
            setTotalReviews={setTotalReviews}
            subCategoryId={subCategoryId}
            reviewsRef={reviewsRef}
          />
        </div>
        <ShowMoreButton
          section="review"
          isExpanded={showMore.review}
          isLong={true} // Always show button for reviews to match behavior
        />
      </div> */}
    </div>
  );
};
