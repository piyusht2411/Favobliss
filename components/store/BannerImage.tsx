import Image from "next/image";
import { FC } from "react";

interface BannerImageProps {
  imageUrl: string;
  altText: string;
  className?: string;
}

const BannerImage: FC<BannerImageProps> = ({
  imageUrl,
  altText,
  className = "",
}) => {
  return (
    <div
      className={`relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden ${className} rounded-2xl`}
    >
      <Image
        src={imageUrl}
        alt={altText}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        priority
      />
    </div>
  );
};

export default BannerImage;
