"use client";

export const ProductBadges = () => {
  const badges = [
    {
      src: "https://www.favobliss.com/image/cache/catalog/badge/AFFORDABLE%20PAYMENT%20(2)-300x270.png",
      alt: "Affordable Payment",
    },
    {
      src: "https://www.favobliss.com/image/cache/catalog/badge/AUTHENTIC%20PRODUCTS-300x270.png",
      alt: "Authentic Products",
    },
    {
      src: "https://www.favobliss.com/image/cache/catalog/badge/BRAND%20WARRANTY-300x270.png",
      alt: "Brand Warranty",
    },
    {
      src: "https://www.favobliss.com/image/cache/catalog/badge/RELIABLE%20DELIVERY%20&%20INSTALLATION-300x270.png",
      alt: "Reliable Delivery & Installation",
    },
  ];

  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap md:flex-row justify-center items-center gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={badge.src}
                alt={badge.alt}
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
