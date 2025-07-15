"use client";

import { Product } from "@/types";

interface ProductFeaturesProps {
  data: Product;
}

export const ProductFeatures = ({ data }: ProductFeaturesProps) => {
  if (
    (!data.enabledFeatures || data.enabledFeatures.length === 0) &&
    (!data.warranty || data.warranty.trim() === "")
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2 mt-3">
      <h3 className="text-base font-semibold text-orange-500">
        Enabled Features
      </h3>
      <ul className="list-disc pl-8 space-y-1 text-gray-700">
        {data.enabledFeatures &&
          data.enabledFeatures.length > 0 &&
          data.enabledFeatures.map((feature, index) => (
            <li key={index} className="text-sm">
              {feature}
            </li>
          ))}
        {data.warranty && data.warranty.trim() !== "" && (
          <li>
            <span className="font-semibold text-base text-orange-500">
              Warranty:{" "}
            </span>
            {data.warranty}
          </li>
        )}
      </ul>
    </div>
  );
};
