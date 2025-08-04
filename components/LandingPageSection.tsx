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

      {/* Grid Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {items.map((item) => (
          <ApplianceCard key={item.id} item={item} />
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

// Example usage:
/*
const applianceItems: ApplianceItem[] = [
  {
    id: '1',
    title: 'Air purifier',
    image: '/images/air-purifier.jpg',
    link: '/appliances/air-purifier',
    backgroundColor: '#f8f9fa'
  },
  {
    id: '2',
    title: 'Dishwasher',
    image: '/images/dishwasher.jpg',
    link: '/appliances/dishwasher',
    backgroundColor: '#fff5f5'
  },
  {
    id: '3',
    title: 'Refrigerators',
    image: '/images/refrigerator.jpg',
    link: '/appliances/refrigerators',
    backgroundColor: '#f0fdf4'
  },
  {
    id: '4',
    title: 'Fan',
    image: '/images/fan.jpg',
    link: '/appliances/fan',
    backgroundColor: '#fefce8'
  }
];

// In your component:
<HomeAppliancesSection
  title="Home Appliances"
  items={applianceItems}
  viewAllLink="/appliances"
  className="max-w-6xl mx-auto"
/>
*/
