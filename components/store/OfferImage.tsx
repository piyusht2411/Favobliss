import React from "react";

interface ProductCardProps {
  imageSrc: string;
  title: string;
}

const OfferImage: React.FC<ProductCardProps> = ({ imageSrc, title }) => {
  return (
    <div className="bg-white flex flex-col items-center text-center">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-contain mb-4 rounded-lg"
      />
    </div>
  );
};

export default OfferImage;
