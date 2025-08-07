import React from "react";

const FeatureHighlights = () => {
  const features = [
    {
      id: 1,
      title: "Free Shipping",
    },
    {
      id: 2,
      title: "Flexible Payment",
    },
    {
      id: 3,
      title: "Authentic Products",
    },
    {
      id: 4,
      title: "Convenient Help",
    },
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-gray-200 rounded-3xl px-6 py-4 text-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
          >
            <h3 className="text-black font-semibold text-lg whitespace-nowrap">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureHighlights;
