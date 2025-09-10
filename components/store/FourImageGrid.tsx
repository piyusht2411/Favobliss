"use client";

import Image from "next/image";

const FourImageGrid = () => {
  const images = [
    {
      id: 1,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1756890803/ypete3ipejp2bkdy9rg9.jpg",
      alt: "LG Washing Machine",
      title: "LG WashTower",
      subtitle: "NEW FORM OF LAUNDRY",
      description: "Unibody Washer & Dryer",
    },
    {
      id: 2,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1756890803/cmw3b1hw1gb7bci3zkyr.jpg",
      alt: "Samsung Galaxy Watch",
      title: "SAMSUNG",
      subtitle: "Galaxy Watch6 | Watch6 Classic",
      description: "Galaxy AI ✨\n\nGet benefits worth ₹12,000*\nPre-order now",
    },
    {
      id: 3,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1756890803/cmw3b1hw1gb7bci3zkyr.jpg",
      alt: "Battery Technology",
      title: "Battery capacity",
      subtitle: "4400 mAh",
      description: "Watch videos up to\n24 hrs",
    },
    {
      id: 4,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1756890804/mzm7ld98uhvohtkliafd.jpg",
      alt: "Gaming Setup",
      title: "Ultimate Gaming",
      subtitle: "Experience",
      description: "Next-gen performance",
    },
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      {/* Desktop and Tablet View (md and above) */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative bg-gradient-to-br ${
              index === 0
                ? "from-blue-100 to-gray-200"
                : index === 1
                ? "from-pink-100 to-purple-200"
                : index === 2
                ? "from-pink-100 to-purple-200"
                : "from-gray-800 to-black"
            } rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300 h-64`}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Mobile View (below md) */}
      <div className="md:hidden space-y-4">
        {/* Horizontal scroll for first three images */}
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1"
          role="region"
          aria-label="Featured images carousel"
        >
          {images.slice(0, 3).map((image, index) => (
            <div
              key={image.id}
              className={`relative bg-gradient-to-br ${
                index === 0
                  ? "from-blue-100 to-gray-200"
                  : index === 1
                  ? "from-pink-100 to-purple-200"
                  : "from-pink-100 to-purple-200"
              } rounded-2xl overflow-hidden flex-shrink-0 w-[85%] h-[85%] snap-start cursor-pointer hover:scale-[1.02] transition-transform duration-300`}
            >
              <img
                src={
                  image.src ||
                  "/placeholder.svg?height=224&width=384&query=promo%20image"
                }
                alt={image.alt}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300">
          <img
            src={
              images[3].src ||
              "/placeholder.svg?height=224&width=384&query=fourth%20promo"
            }
            alt={images[3].alt}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default FourImageGrid;
