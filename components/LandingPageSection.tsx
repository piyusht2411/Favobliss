import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ApplianceItem {
  id: string;
  title: string;
  image: string;
  link: string;
  backgroundColor?: string;
}

interface HomeAppliancesSectionProps {
  title: string;
  items: ApplianceItem[];
  viewAllLink?: string;
  className?: string;
  handleCategoryChange: (id: string) => void;
}

const LandingPageSection: React.FC<HomeAppliancesSectionProps> = ({
  title,
  items,
  viewAllLink,
  className = "",
  handleCategoryChange,
}) => {
  return (
    <div className={`rounded-2xl p-3 md:p-6 w-full max-w-full ${className}`}>
      {title?.length > 0 && (
        <div className="flex justify-between items-center mb-3 md:mb-6">
          <h2 className="text-base md:text-xl font-semibold text-gray-900">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-sm md:text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              View All
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 bg-white p-3 rounded-xl">
        {items.map((item) => (
          <div key={item.id}>
            <ApplianceCard
              item={item}
              handleCategoryChange={handleCategoryChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ApplianceCardProps {
  item: ApplianceItem;
  handleCategoryChange: (id: string) => void;
}

const ApplianceCard: React.FC<ApplianceCardProps> = React.memo(
  ({ item, handleCategoryChange }) => {
    return (
      <div
        onClick={() => handleCategoryChange(item.id)}
        className="bg-[#d9d9d9] rounded-xl p-3"
      >
        <div className="group cursor-pointer">
          <div className="relative w-full aspect-square rounded-xl mb-3 overflow-hidden transition-transform group-hover:scale-105">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>

          <h3 className="text-sm font-medium text-gray-900 text-center group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
        </div>
      </div>
    );
  }
);

ApplianceCard.displayName = "ApplianceCard";

export default LandingPageSection;
