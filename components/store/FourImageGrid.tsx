import React from "react";

const FourImageGrid = () => {
  const images = [
    {
      id: 1,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754574265/j2w3xc4csu2fkz4ny8oi.png",
      alt: "LG Washing Machine",
      title: "LG WashTower",
      subtitle: "NEW FORM OF LAUNDRY",
      description: "Unibody Washer & Dryer",
    },
    {
      id: 2,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754574322/r5fdsilatratvtncjjrw.png",
      alt: "Samsung Galaxy Watch",
      title: "SAMSUNG",
      subtitle: "Galaxy Watch6 | Watch6 Classic",
      description: "Galaxy AI ✨\n\nGet benefits worth ₹12,000*\nPre-order now",
    },
    {
      id: 3,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754574322/r5fdsilatratvtncjjrw.png",
      alt: "Battery Technology",
      title: "Battery capacity",
      subtitle: "4400 mAh",
      description: "Watch videos up to\n24 hrs",
    },
    {
      id: 4,
      src: "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754574358/ocfeflzhw0ysxdkc237m.jpg",
      alt: "Gaming Setup",
      title: "Ultimate Gaming",
      subtitle: "Experience",
      description: "Next-gen performance",
    },
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        <div className="relative bg-gradient-to-br from-blue-100 to-gray-200 rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
          <img
            src={images[0].src || "/placeholder.svg"}
            alt={images[0].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex-1 relative bg-gradient-to-br from-pink-100 to-purple-200 rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            <img
              src={images[1].src || "/placeholder.svg"}
              alt={images[1].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
            <img
              src={images[2].src || "/placeholder.svg"}
              alt={images[2].alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Column 3: Fourth image - spans full height */}
        <div className="relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
          <img
            src={images[3].src || "/placeholder.svg"}
            alt={images[3].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      </div>

      <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-4">
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
              className={`w-full h-full object-cover`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* <div
              className={`absolute ${
                index === 2
                  ? "inset-0 flex flex-col justify-center items-center text-center"
                  : "bottom-4 left-4"
              } text-white p-4`}
            >
              <h3
                className={`font-bold mb-1 ${
                  index === 2 ? "text-lg" : "text-lg"
                }`}
              >
                {image.title}
              </h3>
              <p
                className={`font-medium mb-1 ${
                  index === 2 ? "text-xl" : "text-sm"
                }`}
              >
                {image.subtitle}
              </p>
              <p className="text-xs opacity-90 whitespace-pre-line">
                {image.description}
              </p>
            </div> */}
          </div>
        ))}
      </div>

      {/* Mobile Grid (sm and below) */}
      <div className="grid md:hidden grid-cols-1 gap-4">
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
            } rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300 h-56`}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className={`w-full h-full object-cover`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div
              className={`absolute ${
                index === 2
                  ? "inset-0 flex flex-col justify-center items-center text-center"
                  : "bottom-4 left-4"
              } text-white p-4`}
            >
              {/* <h3 className="text-lg font-bold mb-1">{image.title}</h3>
              <p
                className={`font-medium mb-1 ${
                  index === 2 ? "text-xl" : "text-sm"
                }`}
              >
                {image.subtitle}
              </p>
              <p className="text-xs opacity-90 whitespace-pre-line">
                {image.description}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FourImageGrid;
