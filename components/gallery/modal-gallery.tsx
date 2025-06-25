"use client";

import { ProductImage } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ModalGalleryProps {
  images: ProductImage[];
  key?: string;
}

export const ModalGallery = ({ images, key }: ModalGalleryProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string>("");

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImageId(images[0].id);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <Tabs
      value={selectedImageId}
      onValueChange={setSelectedImageId}
      className="flex flex-col-reverse"
      key={key}
    >
      <div className="mx-auto mt-6 w-full max-w-2xl">
        <TabsList
          className="grid gap-2 h-auto bg-white p-0"
          style={{
            gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
          }}
        >
          {images.slice(0, 4).map((image, index) => (
            <TabsTrigger
              key={image.id}
              value={image.id}
              className="relative flex aspect-square cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-zinc-300 data-[state=active]:border-zinc-800 p-0"
            >
              <Image
                src={image.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="(max-width: 768px) 25vw, 15vw"
              />
            </TabsTrigger>
          ))}
        </TabsList>
        {images.length > 4 && (
          <p className="text-center text-sm text-zinc-500 mt-2">
            +{images.length - 4} more images
          </p>
        )}
      </div>

      {images.map((image, index) => (
        <TabsContent
          key={image.id}
          value={image.id}
          className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-50"
        >
          <Image
            src={image.url}
            alt={`Product image ${index + 1}`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
