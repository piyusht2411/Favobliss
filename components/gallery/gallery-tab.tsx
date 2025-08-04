import Image from "next/image";
import { VariantImage } from "@/types";
import { TabsTrigger } from "../ui/tabs";
import { FaPlay } from "react-icons/fa";

interface GalleryTabProps {
  image: VariantImage;
}

export const GalleryTab = ({ image }: GalleryTabProps) => {
  return (
    <TabsTrigger
      value={image.id}
      className="relative flex aspect-square md:cursor-pointer overflow-hidden"
    >
      {image.mediaType === "IMAGE" ? (
        <Image
          src={image.url}
          alt="Image"
          fill
          className="object-cover aspect-square overflow-hidden"
        />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            src={image.url}
            className="object-cover aspect-square overflow-hidden"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <FaPlay className="text-white text-xl" />
          </div>
        </div>
      )}
    </TabsTrigger>
  );
};
