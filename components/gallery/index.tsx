"use client";

import Image from "next/image";
import { VariantImage } from "@/types";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { GalleryTab } from "./gallery-tab";
import { PiShareFatFill } from "react-icons/pi";
import { useShareModal } from "@/hooks/use-share-modal";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Skeleton } from "@/components/ui/skeleton";
import { GallerySkeleton } from "./gallery-skeleton";

interface GalleryProps {
  images: VariantImage[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const { onOpen } = useShareModal();
  const [activeTab, setActiveTab] = useState(images[0]?.id || "");
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length > 0) {
      setActiveTab(images[0].id);
      setLoadedImages([]);
      setIsLoading(true);
    }
  }, [images]);
  useEffect(() => {
    if (images.length > 0 && loadedImages.length >= images.length) {
      setIsLoading(false);
    }
  }, [loadedImages, images]);
  useEffect(() => {
    if (images.length > 0 && isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [images, isLoading]);

  // Handle image load
  const handleImageLoad = (imageId: string) => {
    setLoadedImages((prev) => {
      const newLoaded = Array.from(new Set([...prev, imageId]));
      return newLoaded;
    });
  };

  const handleImageError = (imageId: string) => {
    handleImageLoad(imageId);
  };

  if (!images.length) {
    return (
      <div className="w-full aspect-[3/4] relative bg-gray-50">
        <Image
          src="/placeholder-image.jpg"
          alt="Placeholder Image"
          fill
          className="object-cover aspect-[3/4]"
          onLoad={() => console.log("Placeholder image loaded")}
        />
      </div>
    );
  }

  const MobileSkeleton = () => (
    <div className="block md:hidden aspect-[3/4] relative">
      <Skeleton className="w-full h-full bg-zinc-200" />
    </div>
  );

  return (
    <div className="w-full">
      {isLoading ? (
        <MobileSkeleton />
      ) : (
        <div className="block md:hidden aspect-[3/4] relative">
          <Swiper
            spaceBetween={10}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="w-full h-full"
          >
            {images.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative aspect-[3/4] w-full h-full bg-gray-50">
                  <Image
                    src={image.url}
                    alt="Variant Image"
                    fill
                    className="object-contain aspect-[3/4]"
                    onLoad={() => handleImageLoad(image.id)}
                    onError={() => handleImageError(image.id)}
                  />
                  <div
                    className="absolute h-10 w-10 top-4 right-4 rounded-full flex items-center justify-center md:cursor-pointer bg-white/70 backdrop-blur-sm"
                    onClick={onOpen}
                  >
                    <PiShareFatFill className="text-zinc-700 h-6 w-6" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {isLoading ? (
        <GallerySkeleton />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="hidden md:flex flex-col-reverse md:px-24 lg:px-20 xl:px-28 relative"
          role="div"
        >
          <div className="mx-auto mt-6 lg:mt-2 w-full max-w-2xl lg:max-w-none lg:absolute top-0 left-0 lg:w-16">
            <TabsList className="grid grid-cols-4 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-4 h-auto bg-white">
              {images.map((image) => (
                <GalleryTab key={image.id} image={image} />
              ))}
            </TabsList>
          </div>
          {images.map((image) => (
            <TabsContent
              key={image.id}
              value={image.id}
              className="aspect-[3/4] relative overflow-hidden bg-gray-50"
            >
              <Image
                src={image.url}
                alt="Variant Image"
                fill
                className="object-contain aspect-[3/4]"
                onLoad={() => handleImageLoad(image.id)}
                onError={() => handleImageError(image.id)}
              />
              <div
                className="absolute h-10 w-10 top-4 right-4 rounded-full flex items-center justify-center md:cursor-pointer bg-white/70 backdrop-blur-sm"
                onClick={onOpen}
              >
                <PiShareFatFill className="text-zinc-700 h-6 w-6" />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
