import type React from "react";
import Image from "next/image";
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
      className={`rounded-3xl w-full max-w-full p-8 pt-[200px] ${className}`}
      style={{ backgroundColor }}
    >
      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <PremiumProductCard key={product.id} product={product} />
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
          {/* Badge */}
          {/* {product.badge && (
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              {product.badge}
            </div>
          )} */}

          {/* Image Container */}
          <div>
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              // width={200}
              // height={200}
              className="object-cover max-w-full max-h-full"
              // sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>

          {/* Content */}
          {/* <div className="text-center mt-auto">
            <div className="text-xs font-bold text-gray-500 tracking-[0.3em] mb-2 uppercase">
              PREMIUM
            </div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {product.title}
            </h3>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default PremiumProductsSection;
// Example usage component
// const ExampleUsage: React.FC = () => {
//   const sampleProducts: PremiumProduct[] = [
//     {
//       id: "1",
//       title: "Soundbars",
//       image: "/placeholder.svg?height=200&width=200",
//       link: "/soundbars",
//     },
//     {
//       id: "2",
//       title: "Smartwatches",
//       image: "/placeholder.svg?height=200&width=200",
//       link: "/smartwatches",
//     },
//     {
//       id: "3",
//       title: "Laptops",
//       image: "/placeholder.svg?height=200&width=200",
//       link: "/laptops",
//     },
//     {
//       id: "4",
//       title: "Gaming laptops",
//       image: "/placeholder.svg?height=200&width=200",
//       link: "/gaming-laptops",
//       badge: "NEW",
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <PremiumProductsSection products={sampleProducts} backgroundColor="#6B5B73" />
//     </div>
//   )
// }

// export default ExampleUsage
