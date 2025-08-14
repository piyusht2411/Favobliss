"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { Product, Variant, Location } from "@/types";
import { formatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiShoppingBag } from "react-icons/hi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ProductFeatures } from "./productFeature";
import BankOffers from "./bankOffer";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAddress } from "@/hooks/use-address";
import { GoShareAndroid } from "react-icons/go";
import { useShareModal } from "@/hooks/use-share-modal";
import Link from "next/link";

interface ProductDetailsProps {
  data: Product;
  defaultVariant: Variant;
  onVariantChange?: (variant: Variant) => void;
  locations: Location[];
  totalReviews: number;
  avgRating: number | null;
  selectedVariant: Variant;
  setSelectedVariant: Dispatch<SetStateAction<Variant>>;
  locationPrice: {
    price: number;
    mrp: number;
  };
  setLocationPrice: Dispatch<
    SetStateAction<{
      price: number;
      mrp: number;
    }>
  >;
  isProductAvailable: boolean;
  setIsProductAvailable: Dispatch<SetStateAction<boolean>>;
  selectedLocationId: string | null;
  setSelectedLocationId: Dispatch<SetStateAction<string | null>>;
  deliveryInfo: {
    location: string;
    estimatedDelivery: number;
  } | null;
  setDeliveryInfo: Dispatch<
    SetStateAction<{
      location: string;
      estimatedDelivery: number;
    } | null>
  >;
}

const formatDeliveryDate = (deliveryDays: number | null): string => {
  const today = new Date();
  if (deliveryDays === null || deliveryDays === undefined) {
    return "Delivery date not available";
  }
  if (deliveryDays === 0) {
    return "Today";
  }
  if (deliveryDays === 1) {
    return "Tomorrow";
  }
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryDays);
  return deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const ProductDetails = (props: ProductDetailsProps) => {
  const {
    data,
    defaultVariant,
    onVariantChange,
    locations,
    totalReviews,
    avgRating,
    selectedVariant,
    setSelectedVariant,
    locationPrice,
    setLocationPrice,
    isProductAvailable,
    setIsProductAvailable,
    selectedLocationId,
    setSelectedLocationId,
    deliveryInfo,
    setDeliveryInfo,
  } = props;

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    defaultVariant.sizeId
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    defaultVariant.colorId
  );
  const [pincode, setPincode] = useState<string>("");

  const [showStickyBar, setShowStickyBar] = useState(true);
  const [isPincodeChecked, setIsPincodeChecked] = useState(false);
  const { data: session } = useSession();
  const { data: addresses, isLoading: isAddressLoading } = useAddress();
  const [defaultLocationData, setDefaultLocationData] =
    useState<Location | null>(null);
  const [currentLocationData, setcurrentLocationData] =
    useState<Location | null>(null);
  const [isCodAvailableForPincode, setIsCodAvailableForPincode] = useState<
    boolean | null
  >(null);
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

  const codAvailable = (pincode: string, locations: Location[]) => {
    const currentLocation = locations.find((item) => item.pincode === pincode);
    setcurrentLocationData(currentLocation ?? null);
    return currentLocation?.isCodAvailable || false;
  };

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
        setIsCodAvailableForPincode(codAvailable(sessionPincode, locations));
        setDeliveryInfo({
          location: `${activeLocation.city}, ${activeLocation.pincode}`,
          estimatedDelivery: activeLocation.deliveryDays,
        });
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
            if (activeLocation) {
              setIsCodAvailableForPincode(
                codAvailable(storedPincode, locations)
              );
              setDeliveryInfo({
                location: `${activeLocation.city}, ${activeLocation.pincode}`,
                estimatedDelivery: activeLocation.deliveryDays,
              });
            }
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
        setIsCodAvailableForPincode(codAvailable(fallbackPincode, locations));
        setDeliveryInfo({
          location: `${activeLocation.city}, ${activeLocation.pincode}`,
          estimatedDelivery: activeLocation.deliveryDays,
        });
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
      setIsCodAvailableForPincode(false);
      setDeliveryInfo(null);
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
          location: `${location.city}, ${location.pincode}`,
          estimatedDelivery: location.deliveryDays,
        });
        setIsCodAvailableForPincode(codAvailable(pincode.trim(), locations));
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
        setIsProductAvailable(false);
        setSelectedLocationId(null);
        setDeliveryInfo({
          location: `Pincode ${pincode.trim()}`,
          estimatedDelivery: 0,
        });
        setIsCodAvailableForPincode(false);
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
    setIsCodAvailableForPincode(null);
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
    selectedVariant,
  ]);

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
        mrp: locationPrice.mrp,
        selectedVariant,
        checkOutQuantity: 1,
        pincode: itemPincode,
        deliveryDays: deliveryInfo?.estimatedDelivery || 0,
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
        mrp: locationPrice.mrp,
        selectedVariant,
        checkOutQuantity: 1,
        pincode: itemPincode,
        deliveryDays: deliveryInfo?.estimatedDelivery || 0,
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
              New Arrival
            </div>
          )}

          <h1 className="text-xl md:text-xl font-bold">{data.name}</h1>
          <Link
            href={`/brand/${data?.brand?.slug}?page=1`}
            className="text-sm text-blue-600 hover:text-blue-700 underline my-2"
          >
            Brand store
          </Link>
          {avgRating && (
            <div className="mt-2">
              <p className="text-[#088466] text-base">
                <span className="inline-flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i < Math.floor(avgRating)
                          ? "fill-current"
                          : "text-gray-300"
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
            </div>
          )}
          {selectedVariant.stock <= 0 && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>Out of stock</AlertDescription>
            </Alert>
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

          {/* <div ref={buttonsRef} className="mt-8 max-w-sm md:block hidden">
            <ActionButtons />
          </div> */}
          <div className="mt-6 space-y-4">
            <div>
              <BankOffers />
            </div>
          </div>

          <div className="mt-4 border-0 rounded-2xl py-6 bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 border-gray-100">
            {!isPincodeChecked && (
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full">
                  <svg
                    className="w-5 h-5 text-orange-600"
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
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-800">
                    Delivery Options
                  </span>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Check availability in your area
                  </p>
                </div>
              </div>
            )}

            {!isPincodeChecked ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter your 6-digit pincode"
                      className="h-12 text-sm pl-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 bg-white shadow-sm"
                      maxLength={6}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 px-6 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 border-0 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePincodeCheck}
                    disabled={!pincode.trim() || pincode.length < 6}
                  >
                    Check
                  </Button>
                </div>
                <div className="bg-orange-100 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-100 rounded-full mt-0.5">
                      <svg
                        className="w-4 h-4 text-[#ee8c1d]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-[#ee8c1d] leading-relaxed">
                      Enter your PIN code to check delivery time & cash on
                      delivery availability in your area
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        isProductAvailable ? "bg-green-100" : "bg-red-100"
                      )}
                    >
                      {isProductAvailable ? (
                        <svg
                          className="w-5 h-5 text-green-600"
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
                      ) : (
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isProductAvailable ? "text-green-800" : "text-red-800"
                        )}
                      >
                        {isProductAvailable
                          ? `Available in ${deliveryInfo?.location}`
                          : `Not available in ${pincode.trim()}`}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Pincode: {pincode.trim()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePincode}
                    className="px-4 py-2 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  >
                    Change
                  </button>
                </div>

                {deliveryInfo && isProductAvailable && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-green-800">
                            Express Delivery
                          </span>
                          <p className="text-lg font-bold text-green-700 mt-1">
                            {formatDeliveryDate(deliveryInfo.estimatedDelivery)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "border rounded-xl p-4",
                        isCodAvailableForPincode
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                          : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            isCodAvailableForPincode
                              ? "bg-blue-100"
                              : "bg-amber-100"
                          )}
                        >
                          {isCodAvailableForPincode ? (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-amber-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              isCodAvailableForPincode
                                ? "text-blue-800"
                                : "text-amber-800"
                            )}
                          >
                            Cash on Delivery
                          </span>
                          <p
                            className={cn(
                              "text-sm mt-0.5",
                              isCodAvailableForPincode
                                ? "text-blue-600"
                                : "text-amber-600"
                            )}
                          >
                            {isCodAvailableForPincode
                              ? "Available"
                              : "Not Available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isProductAvailable && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-full mt-0.5">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-red-800 mb-1">
                          Delivery Not Available
                        </h4>
                        <p className="text-sm text-red-700 leading-relaxed">
                          Sorry, this product is not available for delivery to
                          <span className="font-semibold mx-1">
                            {pincode.trim()}
                          </span>
                          Please try a different pincode or contact customer
                          support for assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <ProductFeatures data={data} />

          {data.expressDelivery && currentLocationData?.isExpressDelivery && (
            <p className="font-bold text-orange-500 text-2xl pt-6">
              {currentLocationData.expressDeliveryText.length > 0
                ? currentLocationData.expressDeliveryText
                : "Express Delivery | Delhi NCR Only | Call Now +91-9540717161"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
