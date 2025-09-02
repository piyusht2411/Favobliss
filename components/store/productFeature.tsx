"use client";

import { ProductApiResponse } from "@/types";

interface ProductFeaturesProps {
  data: ProductApiResponse;
}

export const ProductFeatures = ({ data }: ProductFeaturesProps) => {
  if (
    (!data.product.enabledFeatures ||
      data.product.enabledFeatures.length === 0) &&
    (!data.product.warranty || data.product.warranty.trim() === "")
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2 mt-3">
      <h3 className="text-base font-semibold text-orange-500">
        Enabled Features
      </h3>
      <ul className="list-disc pl-8 space-y-1 text-gray-700">
        {data.product.enabledFeatures &&
          data.product.enabledFeatures.length > 0 &&
          data.product.enabledFeatures.map((feature, index) => (
            <li key={index} className="text-sm">
              {feature}
            </li>
          ))}
        {data.product.warranty && data.product.warranty.trim() !== "" && (
          <li>
            <span className="font-semibold text-base text-orange-500">
              Warranty:{" "}
            </span>
            {data.product.warranty}
          </li>
        )}
      </ul>
    </div>
  );
};
