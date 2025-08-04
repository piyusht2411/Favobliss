"use client";

import { VariantImage } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

interface ModalGalleryProps {
  images: VariantImage[];
  key?: string;
}

interface VideoState {
  isPlaying: boolean;
  showControls: boolean;
  isLoading: boolean;
}

export const ModalGallery = ({ images, key }: ModalGalleryProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string>("");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [videoStates, setVideoStates] = useState<Record<string, VideoState>>(
    {}
  );
  const controlsTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImageId(images[0].id);

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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(controlsTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 text-sm">No media available</p>
      </div>
    );
  }

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
          {images.slice(0, 4).map((media, index) => (
            <TabsTrigger
              key={media.id}
              value={media.id}
              className="relative flex aspect-square cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-zinc-300 data-[state=active]:border-zinc-800 p-0"
            >
              {media.mediaType === "IMAGE" ? (
                <Image
                  src={media.url}
                  alt={`Product media ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 768px) 25vw, 15vw"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video src={media.url} className="object-contain p-1" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white bg-opacity-90 rounded-full p-2">
                      <FaPlay className="text-black text-sm ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {images.length > 4 && (
          <p className="text-center text-sm text-zinc-500 mt-2">
            +{images.length - 4} more media
          </p>
        )}
      </div>

      {images.map((media, index) => (
        <TabsContent
          key={media.id}
          value={media.id}
          className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-50"
        >
          {media.mediaType === "IMAGE" ? (
            <Image
              src={media.url}
              alt={`Product media ${index + 1}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
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
                className="object-contain p-4 max-h-full w-full"
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

              {/* Video Progress Bar (Optional) */}
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
  );
};
