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
  title?: string;
  items: ApplianceItem[];
  viewAllLink?: string;
  className?: string;
}

const LandingPageSection: React.FC<HomeAppliancesSectionProps> = ({
  title = "Home Appliances",
  items,
  viewAllLink,
  className = "",
}) => {
  return (
    <div className={`rounded-2xl p-6 w-full max-w-full ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            View All
          </Link>
        )}
      </div>

      {/* Flex Container with Scroll */}
      <div className="flex overflow-x-auto space-x-6 md:space-x-12 pb-4 scrollbar-hide snap-x snap-mandatory">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-none w-[45vw] md:w-[22%] snap-start"
          >
            <ApplianceCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ApplianceCardProps {
  item: ApplianceItem;
}

const ApplianceCard: React.FC<ApplianceCardProps> = ({ item }) => {
  return (
    <Link href={item.link}>
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full aspect-square rounded-3xl mb-3 overflow-hidden transition-transform group-hover:scale-105">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 text-center group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default LandingPageSection;
