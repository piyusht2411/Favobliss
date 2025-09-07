import type React from "react";
import Link from "next/link";

interface PremiumProduct {
  id: string;
  title: string;
  image: string;
  link: string;
  badge?: string;
}

interface PremiumProductsSectionProps {
  products: PremiumProduct[];
  backgroundColor?: string;
  className?: string;
}

const PremiumProductsSection: React.FC<PremiumProductsSectionProps> = ({
  products,
  backgroundColor = "#6B5B73",
  className = "",
}) => {
  return (
    <div
      className={`rounded-3xl w-full max-w-full px-4 py-8 md:p-8 pt-[200px] ${className}`}
      style={{ backgroundColor }}
    >
      <div className="flex overflow-x-auto space-x-6 pb-1 md:pb-4 scrollbar-hide snap-x snap-mandatory justify-between">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-none w-[30vw] sm:w-[30vw] lg:w-[23%] snap-start"
          >
            <PremiumProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface PremiumProductCardProps {
  product: PremiumProduct;
}

const PremiumProductCard: React.FC<PremiumProductCardProps> = ({ product }) => {
  return (
    <Link href={product.link}>
      <div className="group cursor-pointer">
        <div className="">
          <div>
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="object-cover max-w-full max-h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PremiumProductsSection;
