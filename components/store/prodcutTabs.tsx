"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ProductDescription } from "@/components/store/productDescription";
import { ProductReviews } from "@/components/store/product-reviews";

interface ProductTabsProps {
  product: Product;
  productId: string;
}

export const ProductTabs = ({ product, productId }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Product Description" },
    { id: "specification", label: "Specification" },
    { id: "return", label: "Return and Refund Policy" },
    { id: "review", label: "Review" },
  ];

  const returnData = [
    "In the refund or replacement or exchange process there is a complete chain to sort out the issues from the side of the customer.",
    `After receiving the product from FAVOBLISS through delivery boy, customer receives product and raises query for refund or replacement or exchange. Again, a particular process is followed so kindly record an unboxing video as per the company policies and mail that video at support@favobliss.com. `,
    `Log in to Favobliss and go to your Orders tab. Tap or click on Return to create a request.`,
    `Select your applicable reason of return — based on which the option of an exchange, where applicable, will appear. Three options will be available:`,
    `Exchange: Your order will be exchanged for a new identical product of a different size or color.`,
    `Replace: The product in your order will be replaced with an identical product in case it is damaged (broken or spoiled) or defective (has a functional problem that causes it not to work).`,
    `Refund: If the product of your choice is unavailable in your preferred size, color or model, or if it is out of stock, you may decide that you want your money back. In this scenario, you may choose a Refund to have your money returned to you. Depending on the kind of product you wish to return, your request may have to undergo a verification process. Following verification, you will be required to confirm your decision based on the category of the product ordered.`,
    `Keep ready all the requisite items necessary for a smooth returns process — including invoice, original packaging, price tags, freebies, accessories, etc.`,
    `Kindly unbox your product safely so that you don’t damage your product’s packaging. Otherwise, your refund or replacement request will not be accepted. If you received a broken or mismatched product, kindly mail us within 24 hrs of your delivery date with video clips and images.`,
    `If you have received a damaged or defective product or if it is not as described or is a mismatched product, you can raise a replacement request on the Website/App/Mobile site within 5 days of receiving the product. In case you have ordered a TV or Mobile, our delivery executive will assist with onsite unboxing.`,
    `Pickup and Delivery of your order will be scheduled hand-in-hand in case of exchanges and replacements. Refund will be initiated and processed if applicable after the pickup has been done within 5–7 working days.`,
    `Your request will be fulfilled according to Favobliss’s returns/replacement guarantee.`,
  ];

  const groupedSpecifications = product.productSpecifications.reduce(
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

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-wrap border-b border-gray-200 justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm md:text-base font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-4">
        {activeTab === "description" && <ProductDescription data={product} />}

        {activeTab === "specification" && (
          <div className="max-w-none">
            <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
              {sortedGroupNames.map((groupName) => (
                <div key={groupName}>
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
        )}

        {activeTab === "return" && (
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
        )}

        {activeTab === "review" && (
          <p className="text-black text-base sm:px-6 lg:px-8 py-2">
            No Reviews
          </p>
        )}
      </div>
    </div>
  );
};
