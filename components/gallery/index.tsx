"use client";

import Image from "next/image";
import { Product, Variant, VariantImage } from "@/types";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { GalleryTab } from "./gallery-tab";
import { useShareModal } from "@/hooks/use-share-modal";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Skeleton } from "@/components/ui/skeleton";
import { GallerySkeleton } from "./gallery-skeleton";
import { ActionButtons } from "../store/ActionButton";
import { FaPlay, FaPause } from "react-icons/fa";

interface GalleryProps {
  images: VariantImage[];
  product: Product;
  selectedVariant: Variant;
  locationPrice: {
    price: number;
    mrp: number;
  };
  isProductAvailable: boolean;
  selectedLocationId: string | null;
  locationPinCode: string | null;
  deliveryInfo: {
    location: string;
    estimatedDelivery: number;
  } | null;
}

interface VideoState {
  isPlaying: boolean;
  showControls: boolean;
  isLoading: boolean;
}

export const Gallery = ({
  images,
  product,
  selectedLocationId,
  selectedVariant,
  isProductAvailable,
  locationPrice,
  deliveryInfo,
  locationPinCode,
}: GalleryProps) => {
  const { onOpen } = useShareModal();
  const [activeTab, setActiveTab] = useState(images[0]?.id || "");
  const [loadedMedia, setLoadedMedia] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [videoStates, setVideoStates] = useState<Record<string, VideoState>>(
    {}
  );
  const controlsTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    if (images.length > 0) {
      setActiveTab(images[0].id);
      setLoadedMedia([]);
      setIsLoading(true);

      // Initialize video states
      const initialStates: Record<string, VideoState> = {};
      images.forEach((media) => {
        if (media.mediaType === "VIDEO") {
          initialStates[media.id] = {
            isPlaying: false,
            showControls: true,
            isLoading: false,
          };
        }
      });
      setVideoStates(initialStates);
    }
  }, [images]);

  useEffect(() => {
    if (images.length > 0 && loadedMedia.length >= images.length) {
      setIsLoading(false);
    }
  }, [loadedMedia, images]);

  useEffect(() => {
    if (images.length > 0 && isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [images, isLoading]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(controlsTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  const handleMediaLoad = (mediaId: string) => {
    setLoadedMedia((prev) => {
      const newLoaded = Array.from(new Set([...prev, mediaId]));
      return newLoaded;
    });
  };

  const handleMediaError = (mediaId: string) => {
    handleMediaLoad(mediaId);
  };

  const updateVideoState = (mediaId: string, updates: Partial<VideoState>) => {
    setVideoStates((prev) => ({
      ...prev,
      [mediaId]: { ...prev[mediaId], ...updates },
    }));
  };

  const handleVideoClick = (index: number, mediaId: string) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const currentState = videoStates[mediaId];

    if (currentState?.isPlaying) {
      video.pause();
      updateVideoState(mediaId, { isPlaying: false, showControls: true });

      // Clear existing timeout
      if (controlsTimeoutRef.current[mediaId]) {
        clearTimeout(controlsTimeoutRef.current[mediaId]);
      }
    } else {
      updateVideoState(mediaId, { isLoading: true });

      video
        .play()
        .then(() => {
          updateVideoState(mediaId, {
            isPlaying: true,
            showControls: true,
            isLoading: false,
          });

          // Hide controls after 3 seconds when playing
          controlsTimeoutRef.current[mediaId] = setTimeout(() => {
            updateVideoState(mediaId, { showControls: false });
          }, 3000);
        })
        .catch((error) => {
          console.error("Video play failed:", error);
          updateVideoState(mediaId, { isLoading: false });
        });
    }
  };

  const handleVideoMouseEnter = (mediaId: string) => {
    updateVideoState(mediaId, { showControls: true });

    // Clear existing timeout
    if (controlsTimeoutRef.current[mediaId]) {
      clearTimeout(controlsTimeoutRef.current[mediaId]);
    }

    // Only hide controls if video is playing
    if (videoStates[mediaId]?.isPlaying) {
      controlsTimeoutRef.current[mediaId] = setTimeout(() => {
        updateVideoState(mediaId, { showControls: false });
      }, 3000);
    }
  };

  const handleVideoMouseLeave = (mediaId: string) => {
    // Only hide controls if video is playing
    if (videoStates[mediaId]?.isPlaying) {
      controlsTimeoutRef.current[mediaId] = setTimeout(() => {
        updateVideoState(mediaId, { showControls: false });
      }, 1000);
    }
  };

  const handleVideoEnded = (mediaId: string) => {
    updateVideoState(mediaId, { isPlaying: false, showControls: true });

    // Clear timeout
    if (controlsTimeoutRef.current[mediaId]) {
      clearTimeout(controlsTimeoutRef.current[mediaId]);
    }
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
            {images.map((media, index) => (
              <SwiperSlide key={media.id}>
                <div className="relative aspect-[3/4] w-full h-full bg-white">
                  {media.mediaType === "IMAGE" ? (
                    <Image
                      src={media.url}
                      alt="Variant Image"
                      fill
                      className="object-contain aspect-[3/4]"
                      onLoad={() => handleMediaLoad(media.id)}
                      onError={() => handleMediaError(media.id)}
                    />
                  ) : (
                    <div
                      className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
                      onTouchStart={() => handleVideoMouseEnter(media.id)}
                      onClick={() => handleVideoClick(index, media.id)}
                    >
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={media.url}
                        className="object-contain aspect-[3/4] max-h-full w-full"
                        muted
                        loop
                        playsInline
                        onEnded={() => handleVideoEnded(media.id)}
                        onLoadStart={() =>
                          updateVideoState(media.id, { isLoading: true })
                        }
                        onCanPlay={() =>
                          updateVideoState(media.id, { isLoading: false })
                        }
                      />

                      {/* Video Controls Overlay */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                          videoStates[media.id]?.showControls
                            ? "bg-black bg-opacity-30 opacity-100"
                            : "bg-transparent opacity-0"
                        }`}
                      >
                        {videoStates[media.id]?.isLoading ? (
                          <div className="bg-white bg-opacity-90 rounded-full p-4">
                            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <div className="bg-white bg-opacity-90 rounded-full p-4 transition-transform duration-200 active:scale-95">
                            {videoStates[media.id]?.isPlaying ? (
                              <FaPause className="text-black text-2xl" />
                            ) : (
                              <FaPlay className="text-black text-2xl ml-1" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Video Progress Bar for Mobile */}
                      {videoStates[media.id]?.isPlaying && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white transition-all duration-100"
                              style={{
                                width: `${
                                  ((videoRefs.current[index]?.currentTime ||
                                    0) /
                                    (videoRefs.current[index]?.duration || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
            <TabsList className="grid grid-cols-4 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-4 h-auto bg-white overflow-x-scroll md:overflow-y-scroll max-h-[60vh] scrollbar-hide">
              {images.map((media) => (
                <GalleryTab key={media.id} image={media} />
              ))}
            </TabsList>
          </div>
          {images.map((media, index) => (
            <TabsContent
              key={media.id}
              value={media.id}
              className="aspect-[3/4] relative overflow-hidden bg-white"
            >
              {media.mediaType === "IMAGE" ? (
                <Image
                  src={media.url}
                  alt="Variant Image"
                  fill
                  className="object-contain aspect-[3/4]"
                  onLoad={() => handleMediaLoad(media.id)}
                  onError={() => handleMediaError(media.id)}
                />
              ) : (
                <div
                  className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
                  onMouseEnter={() => handleVideoMouseEnter(media.id)}
                  onMouseLeave={() => handleVideoMouseLeave(media.id)}
                  onClick={() => handleVideoClick(index, media.id)}
                >
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={media.url}
                    className="object-contain aspect-[3/4] max-h-full w-full"
                    muted
                    loop
                    playsInline
                    onEnded={() => handleVideoEnded(media.id)}
                    onLoadStart={() =>
                      updateVideoState(media.id, { isLoading: true })
                    }
                    onCanPlay={() =>
                      updateVideoState(media.id, { isLoading: false })
                    }
                  />

                  {/* Video Controls Overlay */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      videoStates[media.id]?.showControls
                        ? "bg-black bg-opacity-30 opacity-100"
                        : "bg-transparent opacity-0"
                    }`}
                  >
                    {videoStates[media.id]?.isLoading ? (
                      <div className="bg-white bg-opacity-90 rounded-full p-4">
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="bg-white bg-opacity-90 rounded-full p-4 transition-transform duration-200 hover:scale-110">
                        {videoStates[media.id]?.isPlaying ? (
                          <FaPause className="text-black text-2xl" />
                        ) : (
                          <FaPlay className="text-black text-2xl ml-1" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Video Progress Bar */}
                  {videoStates[media.id]?.isPlaying && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-100"
                          style={{
                            width: `${
                              ((videoRefs.current[index]?.currentTime || 0) /
                                (videoRefs.current[index]?.duration || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
      <div className="mt-4 max-w-sm mx-auto hidden md:block">
        <ActionButtons
          product={product}
          selectedVariant={selectedVariant}
          locationPrice={locationPrice}
          selectedLocationId={selectedLocationId}
          isProductAvailable={isProductAvailable}
          className="w-full"
          deliveryInfo={deliveryInfo}
          locationPinCode={locationPinCode}
        />
      </div>
    </div>
  );
};
