"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Product, Variant, Location } from "@/types";
import { formatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiShoppingBag } from "react-icons/hi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ProductFeatures } from "./productFeature";
import BankOffers from "./bankOffer";
import DeliveryInfo from "./delieveryInfo";
import KeyFeatures from "./keyFeatures";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAddress } from "@/hooks/use-address";
import { GoShareAndroid } from "react-icons/go";
import { useShareModal } from "@/hooks/use-share-modal";

interface ProductDetailsProps {
  data: Product;
  defaultVariant: Variant;
  onVariantChange?: (variant: Variant) => void;
  locations: Location[];
  totalReviews: number;
  avgRating: number | null;
}

export const ProductDetails = (props: ProductDetailsProps) => {
  const {
    data,
    defaultVariant,
    onVariantChange,
    locations,
    totalReviews,
    avgRating,
  } = props;

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    defaultVariant.sizeId
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    defaultVariant.colorId
  );
  const [pincode, setPincode] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [locationPrice, setLocationPrice] = useState<{
    price: number;
    mrp: number;
  }>({
    price: selectedVariant.price,
    mrp: selectedVariant.mrp || selectedVariant.price,
  });
  const [showStickyBar, setShowStickyBar] = useState(true);
  const [isPincodeChecked, setIsPincodeChecked] = useState(false);
  const [isProductAvailable, setIsProductAvailable] = useState(true);
  const { data: session } = useSession();
  const { data: addresses, isLoading: isAddressLoading } = useAddress();
  // const [locationInitialized, setLocationInitialized] = useState(false);
  const [defaultLocationData, setDefaultLocationData] =
    useState<Location | null>();
  const [deliveryInfo, setDeliveryInfo] = useState<{
    location: string;
    estimatedDelivery: string;
    deliveryCharges: string;
  } | null>(null);
  const { addItem } = useCart();
  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { onOpen } = useShareModal();

  const uniqueSizes = Array.from(
    new Map(
      data.variants
        .filter((v) => v.size && v.sizeId)
        .map((v) => [v.sizeId, v.size])
    ).entries()
  ).map(([id, size]) => ({ id, size }));

  const uniqueColors = Array.from(
    new Map(
      data.variants
        .filter((v) => v.color && v.colorId)
        .map((v) => [v.colorId, v.color])
    ).entries()
  ).map(([id, color]) => ({ id, color }));

  const availableSizes = uniqueSizes.filter(({ id }) =>
    selectedColor
      ? data.variants.some(
          (v) => v.sizeId === id && v.colorId === selectedColor
        )
      : true
  );

  const availableColors = uniqueColors.filter(({ id }) =>
    selectedSize
      ? data.variants.some((v) => v.colorId === id && v.sizeId === selectedSize)
      : true
  );

  const initializeDefaultPrice = useCallback(() => {
    let activeLocation: any = null;
    if (session?.user && addresses?.length && !isAddressLoading) {
      const firstAddress = addresses[0];
      const sessionPincode = String(firstAddress.zipCode).trim();

      activeLocation = locations.find(
        (loc) => String(loc.pincode).trim() === sessionPincode
      );

      if (activeLocation) {
        const sessionLocation = {
          city: firstAddress.district || "Unknown",
          pincode: sessionPincode,
          state: firstAddress.state,
          country: "India",
        };

        localStorage.setItem("locationData", JSON.stringify(sessionLocation));
        window.dispatchEvent(new Event("locationDataUpdated"));
      }
    }

    if (!activeLocation) {
      const storedLocation = localStorage.getItem("locationData");
      if (storedLocation) {
        try {
          const parsed = JSON.parse(storedLocation);
          const storedPincode = parsed?.pincode
            ? String(parsed.pincode).trim()
            : null;

          if (storedPincode) {
            activeLocation = locations.find(
              (loc) => String(loc.pincode).trim() === storedPincode
            );
          }
        } catch (e) {
          console.error("Error parsing locationData:", e);
        }
      }
    }

    if (!activeLocation) {
      const fallbackPincode = "110040";
      activeLocation = locations.find(
        (loc) => String(loc.pincode).trim() === fallbackPincode
      );

      if (activeLocation) {
        const fallbackLocation = {
          city: activeLocation.city,
          state: activeLocation.state,
          country: activeLocation.country,
          pincode: activeLocation.pincode,
        };
        localStorage.setItem("locationData", JSON.stringify(fallbackLocation));
        window.dispatchEvent(new Event("locationDataUpdated"));
      }
    }

    if (activeLocation) {
      const variantPrice = selectedVariant.variantPrices?.find(
        (vp) => vp.locationId === activeLocation.id
      );

      setDefaultLocationData(activeLocation);
      setSelectedLocationId(activeLocation.id);
      setLocationPrice({
        price: variantPrice?.price || selectedVariant.price,
        mrp: variantPrice?.mrp || selectedVariant.mrp || selectedVariant.price,
      });
    } else {
      console.error("No active location found!");
      setLocationPrice({
        price: selectedVariant.price,
        mrp: selectedVariant.mrp || selectedVariant.price,
      });
    }
  }, [locations, selectedVariant, session, addresses, isAddressLoading]);

  const handlePincodeCheck = () => {
    if (pincode.trim()) {
      const location = locations.find((loc) => loc.pincode === pincode.trim());

      if (location) {
        const variantPrice = selectedVariant.variantPrices?.find(
          (vp) => vp.locationId === location.id
        );

        setIsProductAvailable(true);
        setSelectedLocationId(location.id);
        setLocationPrice({
          price: variantPrice?.price || selectedVariant.price,
          mrp:
            variantPrice?.mrp || selectedVariant.mrp || selectedVariant.price,
        });
        setDeliveryInfo({
          location:
            `${location.city}, ${location.pincode}` ||
            `Pincode ${pincode.trim()}`,
          estimatedDelivery: "2-3 business days",
          deliveryCharges: "Free delivery",
        });
        const locationData = {
          city: location.city,
          state: location.state,
          country: location.country,
          pincode: location.pincode,
        };
        localStorage.setItem("locationData", JSON.stringify(locationData));
        window.dispatchEvent(new Event("locationDataUpdated"));
        setIsPincodeChecked(true);
      } else {
        // Location not found - product not available
        setIsProductAvailable(false);
        setSelectedLocationId(null);
        setDeliveryInfo({
          location: `Pincode ${pincode.trim()}`,
          estimatedDelivery: "Not available",
          deliveryCharges: "Not available",
        });
        const defaultLocationDataUpdated = {
          city: defaultLocationData?.city,
          state: defaultLocationData?.state,
          country: defaultLocationData?.country,
          pincode: defaultLocationData?.pincode,
        };
        localStorage.setItem(
          "locationData",
          JSON.stringify(defaultLocationDataUpdated)
        );
        window.dispatchEvent(new Event("locationDataUpdated"));
        setIsPincodeChecked(true);
      }
    }
  };

  const handleChangePincode = () => {
    setIsPincodeChecked(false);
    setIsProductAvailable(true);
    setDeliveryInfo(null);
    setPincode("");
    // Reset to default price
    initializeDefaultPrice();
  };

  useEffect(() => {
    if (!isPincodeChecked) {
      initializeDefaultPrice();
    }
  }, [
    isPincodeChecked,
    initializeDefaultPrice,
    addresses,
    isAddressLoading,
    locations,
    selectedVariant, // Add this to re-run when variant changes
  ]);

  // Handle sticky bar visibility
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      const footerRect = footer?.getBoundingClientRect();
      const isFooterVisible = footerRect && footerRect.top < window.innerHeight;

      if (isFooterVisible) {
        setShowStickyBar(false);
        return;
      }

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowStickyBar(true);
        return;
      }

      if (buttonsRef.current && containerRef.current) {
        const buttonsRect = buttonsRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const shouldShow =
          buttonsRect.bottom < window.innerHeight * 0.8 ||
          containerRect.bottom < window.innerHeight;
        setShowStickyBar(!shouldShow);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    const container = containerRef.current?.closest(".overflow-y-scroll");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const variant = data.variants.find(
      (v) => v.sizeId === selectedSize && v.colorId === selectedColor
    );

    if (variant) {
      setSelectedVariant(variant);
      onVariantChange?.(variant);
    }
  }, [selectedSize, selectedColor, data.variants, onVariantChange]);

  const handleSizeChange = useCallback(
    (sizeId: string) => {
      setSelectedSize(sizeId);

      if (
        selectedColor &&
        !data.variants.some(
          (v) => v.sizeId === sizeId && v.colorId === selectedColor
        )
      ) {
        const availableColorForSize = data.variants.find(
          (v) => v.sizeId === sizeId
        )?.colorId;
        setSelectedColor(availableColorForSize);
      }
      // handlePincodeCheck();
    },
    [selectedColor, data.variants]
  );

  useEffect(() => {
    if (isPincodeChecked && selectedLocationId) {
      const variantPrice = selectedVariant.variantPrices?.find(
        (vp) => vp.locationId === selectedLocationId
      );
      setLocationPrice({
        price: variantPrice?.price || selectedVariant.price,
        mrp: variantPrice?.mrp || selectedVariant.mrp || selectedVariant.price,
      });
    }
  }, [selectedVariant, selectedLocationId, isPincodeChecked]);

  const handleColorChange = useCallback(
    (colorId: string) => {
      setSelectedColor(colorId);

      if (
        selectedSize &&
        !data.variants.some(
          (v) => v.colorId === colorId && v.sizeId === selectedSize
        )
      ) {
        const availableSizeForColor = data.variants.find(
          (v) => v.colorId === colorId
        )?.sizeId;
        setSelectedSize(availableSizeForColor);
      }
    },
    [selectedSize, data.variants]
  );

  const onHandleCart = useCallback(() => {
    if (!isProductAvailable) return;
    const selectedLocation = locations.find(
      (loc) => loc.id === selectedLocationId
    );
    const itemPincode = selectedLocation?.pincode || "";

    try {
      addItem({
        ...data,
        price: locationPrice.price,
        selectedVariant,
        checkOutQuantity: 1,
        pincode: itemPincode,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [
    addItem,
    data,
    selectedVariant,
    locationPrice,
    selectedLocationId,
    isProductAvailable,
  ]);

  const onHandleBuyNow = useCallback(() => {
    if (!isProductAvailable) return;
    const selectedLocation = locations.find(
      (loc) => loc.id === selectedLocationId
    );
    const itemPincode = selectedLocation?.pincode || "";

    try {
      addItem({
        ...data,
        price: locationPrice.price,
        selectedVariant,
        checkOutQuantity: 1,
        // locationId: selectedLocationId,
        pincode: itemPincode,
      });
      router.push("/checkout/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [
    addItem,
    data,
    selectedVariant,
    locationPrice,
    selectedLocationId,
    router,
    isProductAvailable,
  ]);

  // Calculate discount percentage
  const discountPercentage = locationPrice.mrp
    ? Math.round(
        ((locationPrice.mrp - locationPrice.price) / locationPrice.mrp) * 100
      )
    : 0;

  const ActionButtons = ({
    className = "",
    isSticky = false,
  }: {
    className?: string;
    isSticky?: boolean;
  }) => (
    <div className={cn("grid grid-cols-2 gap-x-4", className)}>
      <Button
        className="h-14 font-bold bg-black hover:bg-gray-800 text-white"
        onClick={onHandleCart}
        disabled={selectedVariant.stock <= 0 || !isProductAvailable}
      >
        <HiShoppingBag className="mr-2 h-5 w-5" />
        ADD TO Cart
      </Button>
      <Button
        variant="outline"
        className="h-14 font-bold border-black text-black hover:bg-gray-50"
        onClick={onHandleBuyNow}
        disabled={selectedVariant.stock <= 0 || !isProductAvailable}
      >
        Buy Now
      </Button>
    </div>
  );

  return (
    <>
      <div ref={containerRef} className="text-black bg-white">
        <div className="container mx-auto px-4 py-3 md:py-3">
          <div
            onClick={onOpen}
            className={`flex items-center justify-end cursor-pointer gap-1 ${
              !data?.isNewArrival ? "pb-4" : "pb-0"
            }`}
          >
            <GoShareAndroid />
            <span className="text-sm">Share</span>
          </div>
          {data.isNewArrival && (
            <div className="text-black w-fit border border-[#434343] rounded-[16px] text-[12px] px-2 py-[2px] mb-3">
              {" "}
              New Arrival
            </div>
          )}

          <h1 className="text-xl md:text-xl font-bold">{data.name}</h1>
          {avgRating && (
            <div className="mt-2">
              <p className="text-[#088466] text-base">
                <span className="inline-flex items-center gap-1">
                  {/* Render stars */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i < Math.floor(5) ? "fill-current" : "text-gray-300"
                      }`}
                      style={{ fontSize: "1.2em" }}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 font-bold text-gray-600 text-sm">
                    {avgRating.toFixed(1)}{" "}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({totalReviews} Ratings & {totalReviews} Reviews)
                  </span>
                </span>
              </p>
              {/* <a
                href="https://www.apple.com/store"
                className="text-[#088466] text-sm underline hover:text-[#066955]"
              >
                Visit the Apple Store
              </a> */}
            </div>
          )}
          {selectedVariant.stock <= 0 && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>Out of stock</AlertDescription>
            </Alert>
          )}
          {/* {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
            <Alert variant="default" className="mt-2">
              <AlertDescription>
                Only {selectedVariant.stock} left in stock!
              </AlertDescription>
            </Alert>
          )} */}

          {/* <div className="flex flex-col gap-y-6 mt-4"> */}
          {/* {availableColors.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map(({ id, color }) => {
                    const isSelected = selectedColor === id;
                    const isAvailable = selectedSize
                      ? data.variants.some(
                          (v) =>
                            v.colorId === id &&
                            v.sizeId === selectedSize &&
                            v.stock > 0
                        )
                      : data.variants.some(
                          (v) => v.colorId === id && v.stock > 0
                        );

                    const variantWithColor = data.variants.find(
                      (v) => v.colorId === id
                    );
                    const previewImage = variantWithColor?.images?.[0]?.url;

                    return (
                      <div
                        key={id}
                        className={cn(
                          "relative group cursor-pointer transition-all duration-200",
                          !isAvailable && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() =>
                          isAvailable && id && handleColorChange(id)
                        }
                      >
                        <div
                          className={cn(
                            "w-16 h-16 rounded-lg border-2 transition-all duration-200 overflow-hidden",
                            isSelected
                              ? "border-black shadow-lg ring-2 ring-black ring-offset-2"
                              : "border-gray-200 hover:border-gray-400",
                            !isAvailable && "grayscale"
                          )}
                        >
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt={color?.name || "Color Preview"}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundColor: color?.value || "#f3f4f6",
                              }}
                            />
                          )}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {color?.name ?? "Unknown"}
                          </div>
                        </div>
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-0.5 bg-red-500 rotate-45 absolute" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )} */}

          {/* {availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3"></div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map(({ id, size }) => {
                    const isSelected = selectedSize === id;
                    const isAvailable = selectedColor
                      ? data.variants.some(
                          (v) =>
                            v.sizeId === id &&
                            v.colorId === selectedColor &&
                            v.stock > 0
                        )
                      : data.variants.some(
                          (v) => v.sizeId === id && v.stock > 0
                        );

                    return (
                      <button
                        key={id}
                        onClick={() =>
                          isAvailable && id && handleSizeChange(id)
                        }
                        disabled={!isAvailable}
                        className={cn(
                          "px-4 py-3 min-w-[3rem] text-sm font-medium rounded-lg border-2 transition-all duration-200",
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-900 hover:border-gray-400",
                          !isAvailable &&
                            "opacity-50 cursor-not-allowed line-through"
                        )}
                      >
                        {size?.value || "Unknown"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )} */}
          {/* </div> */}

          {(availableSizes.length > 0 || availableColors.length > 0) && (
            <div className="flex flex-col gap-y-1 mt-4 border-t border-b pt-[12px] pb-[12px] border-t-[#d9d9d9] border-b-[#d9d9d9]">
              {availableSizes.length > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <div className="">
                    <span className="font-bold text-sm text-[#262626]">
                      Internal Storage
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(({ id, size }) => {
                      const isSelected = selectedSize === id;
                      const isAvailable = selectedColor
                        ? data.variants.some(
                            (v) =>
                              v.sizeId === id &&
                              v.colorId === selectedColor &&
                              v.stock > 0
                          )
                        : data.variants.some(
                            (v) => v.sizeId === id && v.stock > 0
                          );

                      return (
                        <button
                          key={id}
                          onClick={() =>
                            isAvailable && id && handleSizeChange(id)
                          }
                          disabled={!isAvailable}
                          className={cn(
                            "text-[12px] px-[12px] py-[4px] rounded-[5px] min-w-[4rem] font-medium border transition-all duration-200",
                            isSelected
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-gray-900 hover:border-gray-400",
                            !isAvailable &&
                              "opacity-50 cursor-not-allowed line-through"
                          )}
                        >
                          {size?.value || "Unknown"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {availableColors.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-start justify-between mb-4 flex-col gap-1">
                    <span className="font-bold text-sm text-[#262626]">
                      Color
                    </span>
                    <span className="text-sm text-gray-900">
                      {availableColors.find((c) => c.id === selectedColor)
                        ?.color?.name || "Black"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map(({ id, color }) => {
                      const isSelected = selectedColor === id;
                      const isAvailable = selectedSize
                        ? data.variants.some(
                            (v) =>
                              v.colorId === id &&
                              v.sizeId === selectedSize &&
                              v.stock > 0
                          )
                        : data.variants.some(
                            (v) => v.colorId === id && v.stock > 0
                          );

                      return (
                        <div
                          key={id}
                          className={cn(
                            "relative cursor-pointer transition-all duration-200",
                            !isAvailable && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() =>
                            isAvailable && id && handleColorChange(id)
                          }
                        >
                          <div
                            className={cn(
                              "w-[30px] h-[30px] rounded-full border-1 transition-all duration-200",
                              isSelected
                                ? "border-black ring-2 ring-black ring-offset-2"
                                : "border-gray-300",
                              !isAvailable && "grayscale"
                            )}
                            style={{
                              backgroundColor: color?.value || "#f3f4f6",
                            }}
                          />
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-0.5 bg-red-500 rotate-45 absolute" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="py-2 rounded-md max-w-md">
            <div className="flex items-center justify-between flex-wrap gap-3 md:gap-0">
              <div className="mt-3 flex items-center gap-2 text-sm flex-wrap">
                <span className="text-2xl font-semibold">
                  {formatter.format(locationPrice.price)}
                </span>
                {locationPrice.mrp && (
                  <>
                    <span className="text-gray-500 text-sm mr-2">
                      MRP{" "}
                      <span className="line-through">
                        {formatter.format(locationPrice.mrp)}
                      </span>
                    </span>
                    <span className="bg-orange-400 text-white text-sm font-bold rounded-full px-2 py-1">
                      {discountPercentage}% off
                    </span>
                    <span className="text-sm text-gray-500">
                      (Incl. of all taxes)
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700">
              <span className="font-medium">
                Low Cost EMI starting from ₹
                {(locationPrice.price / 24).toFixed(0)}/mo*
              </span>
            </div>
          </div>

          <div ref={buttonsRef} className="mt-8 max-w-sm md:block hidden">
            <ActionButtons />
          </div>
          <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Delivery Options
              </span>
            </div>

            {!isPincodeChecked ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter pincode"
                    className="flex-1 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    maxLength={6}
                  />
                  <Button
                    variant="outline"
                    className="h-9 px-4 text-sm font-medium text-blue-600 border-blue-600 hover:bg-blue-50"
                    onClick={handlePincodeCheck}
                    disabled={!pincode.trim() || pincode.length < 6}
                  >
                    Check
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Please enter PIN code to check delivery time & pay on delivery
                  availability
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className={cn(
                        "w-4 h-4",
                        isProductAvailable ? "text-green-600" : "text-red-600"
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {isProductAvailable ? (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isProductAvailable ? "text-gray-900" : "text-red-700"
                      )}
                    >
                      {isProductAvailable
                        ? `Deliver to ${deliveryInfo?.location}`
                        : `{Product not available at ${pincode.trim()}}`}
                    </span>
                  </div>
                  <button
                    onClick={handleChangePincode}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Change
                  </button>
                </div>

                {deliveryInfo && isProductAvailable && (
                  <div className="space-y-2">
                    {/* <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {deliveryInfo.estimatedDelivery}
                      </span>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {deliveryInfo.deliveryCharges}
                      </span>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">
                        Pay on Delivery available
                      </span>
                    </div> */}
                  </div>
                )}

                {!isProductAvailable && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-red-700">
                      Sorry, this product is not available for delivery to your
                      location{" "}
                      <span className="font-bold">{pincode.trim()}</span>.
                      Please try a different pincode.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <BankOffers />
            </div>
            {/* <div className="max-w-4xl mx-auto py-4 mt-5">
              <DeliveryInfo />
              <KeyFeatures />
            </div> */}
          </div>

          <ProductFeatures data={data} />

          {data.expressDelivery && (
            <p className="font-bold text-orange-500 text-2xl pt-6">
              Express Delivery | Delhi Ncr Only | Call Now +91-9540717161
            </p>
          )}

          {/* <div ref={buttonsRef} className="mt-8 max-w-sm md:block hidden">
            <ActionButtons />
          </div> */}
        </div>
      </div>
    </>
  );
};
