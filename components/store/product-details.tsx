"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Product,
  LocationGroup,
  Address,
  ProductApiResponse,
  Variant,
} from "@/types";
import { formatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ProductFeatures } from "./productFeature";
import BankOffers from "./bankOffer";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAddress } from "@/hooks/use-address";
import { GoShareAndroid } from "react-icons/go";
import { useShareModal } from "@/hooks/use-share-modal";
import Link from "next/link";

interface ProductDetailsProps {
  productData: ProductApiResponse;
  defaultVariant: Variant;
  onVariantChange?: (variant: Variant) => void;
  locationGroups: LocationGroup[];
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
  selectedLocationGroupId: string | null;
  setSelectedLocationGroupId: Dispatch<SetStateAction<string | null>>;
  deliveryInfo: {
    location: string;
    estimatedDelivery: number;
    isCodAvailable: boolean;
  } | null;
  setDeliveryInfo: Dispatch<
    SetStateAction<{
      location: string;
      estimatedDelivery: number;
      isCodAvailable: boolean;
    } | null>
  >;
  divRef?: React.RefObject<HTMLDivElement>;
  reviewsRef?: React.RefObject<HTMLDivElement>;
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
    productData,
    defaultVariant,
    onVariantChange,
    locationGroups,
    totalReviews,
    avgRating,
    selectedVariant,
    setSelectedVariant,
    locationPrice,
    setLocationPrice,
    isProductAvailable,
    setIsProductAvailable,
    selectedLocationGroupId,
    setSelectedLocationGroupId,
    deliveryInfo,
    setDeliveryInfo,
    divRef,
    reviewsRef,
  } = props;

  const { variant, product, allVariants } = productData;
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>(
    defaultVariant.sizeId
  );
  const [selectedColorId, setSelectedColorId] = useState<string | undefined>(
    defaultVariant.colorId
  );
  const [pincode, setPincode] = useState<string>("");
  const [showStickyBar, setShowStickyBar] = useState(true);
  const [isPincodeChecked, setIsPincodeChecked] = useState(false);
  const { data: session } = useSession();
  const { data: addresses, isLoading: isAddressLoading } = useAddress();
  const [defaultLocationGroupData, setDefaultLocationGroupData] =
    useState<LocationGroup | null>(null);
  const [currentLocationGroupData, setCurrentLocationGroupData] =
    useState<LocationGroup | null>(null);
  const [isCodAvailableForPincode, setIsCodAvailableForPincode] = useState<
    boolean | null
  >(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { onOpen } = useShareModal();

  const uniqueSizes = Array.from(
    new Map(
      allVariants
        .filter((v) => v.sizeId)
        .map((v) => [v.sizeId, { id: v.sizeId, name: v.size }])
    ).values()
  );

  const uniqueColors = Array.from(
    new Map(
      allVariants
        .filter((v) => v.colorId)
        .map((v) => [
          v.colorId,
          { id: v.colorId, name: v.color, value: v.color },
        ])
    ).values()
  );

  const availableSizes = uniqueSizes;
  const availableColors = uniqueColors;

  useEffect(() => {
    const matchingVariant = allVariants.find(
      (v) => v.sizeId === selectedSizeId && v.colorId === selectedColorId
    );

    if (matchingVariant && matchingVariant.id !== selectedVariant.id) {
      router.push(`/product/${matchingVariant.slug}`);
    }
  }, [selectedSizeId, selectedColorId, allVariants]);

  const codAvailable = (pincode: string, locationGroups: LocationGroup[]) => {
    const foundGroup = locationGroups.find((group) =>
      group.locations.some((loc) => loc.pincode === pincode)
    );
    if (foundGroup) {
      setCurrentLocationGroupData(foundGroup);
      return foundGroup.isCodAvailable;
    }
    return false;
  };

  const getFallbackGroup = () => {
    return (
      locationGroups.find((group) =>
        group.locations.some((loc) => loc.pincode === "110040")
      ) ?? null
    );
  };

  const initializeDefaultPrice = useCallback(() => {
    let activeLocationGroup: LocationGroup | null = null;
    let usedPincode: string | null = null;

    if (session?.user && addresses?.length && !isAddressLoading) {
      const defaultAddress = addresses.find(
        (address: Address) => address.isDefault
      );

      if (defaultAddress) {
        const sessionPincode = String(defaultAddress.zipCode).trim();
        usedPincode = sessionPincode;
        activeLocationGroup =
          locationGroups.find((group) =>
            group.locations.some((loc) => loc.pincode === sessionPincode)
          ) ?? null;

        if (activeLocationGroup) {
          const variantPrice = selectedVariant.variantPrices?.find(
            //@ts-ignore
            (vp) => vp.locationGroupId === activeLocationGroup.id
          );

          // Check if price is 0 (product not available)
          if (variantPrice && variantPrice.price === 0) {
            setIsProductAvailable(false);
            setCurrentLocationGroupData(null);

            // Fallback to 110040
            const fallbackGroup = getFallbackGroup();
            let fallbackVariantPrice = null;
            if (fallbackGroup) {
              fallbackVariantPrice = selectedVariant.variantPrices?.find(
                (vp) => vp.locationGroupId === fallbackGroup.id
              );
            }

            setSelectedLocationGroupId(fallbackGroup?.id || null);
            setLocationPrice({
              price: fallbackVariantPrice?.price || 0,
              mrp: fallbackVariantPrice?.mrp || 0,
            });

            const matchedLocation = activeLocationGroup.locations.find(
              (loc) => loc.pincode === sessionPincode
            );
            const sessionLocation = {
              city:
                defaultAddress.district || matchedLocation?.city || "Unknown",
              pincode: sessionPincode,
              state:
                defaultAddress.state || matchedLocation?.state || "Unknown",
              country: "India",
            };

            localStorage.setItem(
              "locationData",
              JSON.stringify(sessionLocation)
            );
            window.dispatchEvent(new Event("locationDataUpdated"));
            setIsCodAvailableForPincode(false);
            setDeliveryInfo({
              location: `${sessionLocation.city}, ${sessionPincode}`,
              estimatedDelivery: 0,
              isCodAvailable: false,
            });
          } else {
            const matchedLocation = activeLocationGroup.locations.find(
              (loc) => loc.pincode === sessionPincode
            );
            const sessionLocation = {
              city:
                defaultAddress.district || matchedLocation?.city || "Unknown",
              pincode: sessionPincode,
              state:
                defaultAddress.state || matchedLocation?.state || "Unknown",
              country: "India",
            };

            localStorage.setItem(
              "locationData",
              JSON.stringify(sessionLocation)
            );
            window.dispatchEvent(new Event("locationDataUpdated"));
            setIsCodAvailableForPincode(activeLocationGroup.isCodAvailable);
            setDeliveryInfo({
              location: `${sessionLocation.city}, ${sessionPincode}`,
              estimatedDelivery: activeLocationGroup.deliveryDays || 0,
              isCodAvailable: activeLocationGroup.isCodAvailable || false,
            });
          }
        }
      } else {
        const firstAddress = addresses[0];
        const sessionPincode = String(firstAddress.zipCode).trim();
        usedPincode = sessionPincode;
        activeLocationGroup =
          locationGroups.find((group) =>
            group.locations.some((loc) => loc.pincode === sessionPincode)
          ) ?? null;

        if (activeLocationGroup) {
          const variantPrice = selectedVariant.variantPrices?.find(
            //@ts-ignore
            (vp) => vp.locationGroupId === activeLocationGroup.id
          );

          // Check if price is 0 (product not available)
          if (variantPrice && variantPrice.price === 0) {
            setIsProductAvailable(false);
            setCurrentLocationGroupData(null);

            // Fallback to 110040
            const fallbackGroup = getFallbackGroup();
            let fallbackVariantPrice = null;
            if (fallbackGroup) {
              fallbackVariantPrice = selectedVariant.variantPrices?.find(
                (vp) => vp.locationGroupId === fallbackGroup.id
              );
            }

            setSelectedLocationGroupId(fallbackGroup?.id || null);
            setLocationPrice({
              price: fallbackVariantPrice?.price || 0,
              mrp: fallbackVariantPrice?.mrp || 0,
            });

            const matchedLocation = activeLocationGroup.locations.find(
              (loc) => loc.pincode === sessionPincode
            );
            const sessionLocation = {
              city: firstAddress.district || matchedLocation?.city || "Unknown",
              pincode: sessionPincode,
              state: firstAddress.state || matchedLocation?.state || "Unknown",
              country: "India",
            };

            localStorage.setItem(
              "locationData",
              JSON.stringify(sessionLocation)
            );
            window.dispatchEvent(new Event("locationDataUpdated"));
            setIsCodAvailableForPincode(false);
            setDeliveryInfo({
              location: `${sessionLocation.city}, ${sessionPincode}`,
              estimatedDelivery: 0,
              isCodAvailable: false,
            });
          } else {
            const matchedLocation = activeLocationGroup.locations.find(
              (loc) => loc.pincode === sessionPincode
            );
            const sessionLocation = {
              city: firstAddress.district || matchedLocation?.city || "Unknown",
              pincode: sessionPincode,
              state: firstAddress.state || matchedLocation?.state || "Unknown",
              country: "India",
            };

            localStorage.setItem(
              "locationData",
              JSON.stringify(sessionLocation)
            );
            window.dispatchEvent(new Event("locationDataUpdated"));
            setIsCodAvailableForPincode(activeLocationGroup.isCodAvailable);
            setDeliveryInfo({
              location: `${sessionLocation.city}, ${sessionPincode}`,
              estimatedDelivery: activeLocationGroup.deliveryDays || 0,
              isCodAvailable: activeLocationGroup.isCodAvailable || false,
            });
          }
        }
      }
    }

    if (!activeLocationGroup) {
      const storedLocation = localStorage.getItem("locationData");
      if (storedLocation) {
        try {
          const parsed = JSON.parse(storedLocation);
          const storedPincode = parsed?.pincode
            ? String(parsed.pincode).trim()
            : null;

          if (storedPincode) {
            usedPincode = storedPincode;
            activeLocationGroup =
              locationGroups.find((group) =>
                group.locations.some((loc) => loc.pincode === storedPincode)
              ) ?? null;
            if (activeLocationGroup) {
              const variantPrice = selectedVariant.variantPrices?.find(
                //@ts-ignore
                (vp) => vp.locationGroupId === activeLocationGroup.id
              );

              // Check if price is 0 (product not available)
              if (variantPrice && variantPrice.price === 0) {
                setIsProductAvailable(false);
                setCurrentLocationGroupData(null);

                // Fallback to 110040
                const fallbackGroup = getFallbackGroup();
                let fallbackVariantPrice = null;
                if (fallbackGroup) {
                  fallbackVariantPrice = selectedVariant.variantPrices?.find(
                    (vp) => vp.locationGroupId === fallbackGroup.id
                  );
                }

                setSelectedLocationGroupId(fallbackGroup?.id || null);
                setLocationPrice({
                  price: fallbackVariantPrice?.price || 0,
                  mrp: fallbackVariantPrice?.mrp || 0,
                });

                const matchedLocation = activeLocationGroup.locations.find(
                  (loc) => loc.pincode === storedPincode
                );
                setIsCodAvailableForPincode(false);
                setDeliveryInfo({
                  location: `${
                    matchedLocation?.city || "Unknown"
                  }, ${storedPincode}`,
                  estimatedDelivery: 0,
                  isCodAvailable: false,
                });
              } else {
                const matchedLocation = activeLocationGroup.locations.find(
                  (loc) => loc.pincode === storedPincode
                );
                setIsCodAvailableForPincode(activeLocationGroup.isCodAvailable);
                setDeliveryInfo({
                  location: `${
                    matchedLocation?.city || "Unknown"
                  }, ${storedPincode}`,
                  estimatedDelivery: activeLocationGroup.deliveryDays || 0,
                  isCodAvailable: activeLocationGroup.isCodAvailable || false,
                });
              }
            }
          }
        } catch (e) {
          console.error("Error parsing locationData:", e);
        }
      }
    }

    if (!activeLocationGroup) {
      const fallbackPincode = "110040";
      usedPincode = fallbackPincode;
      activeLocationGroup =
        locationGroups.find((group) =>
          group.locations.some((loc) => loc.pincode === fallbackPincode)
        ) ?? null;

      if (activeLocationGroup) {
        const variantPrice = selectedVariant.variantPrices?.find(
          //@ts-ignore
          (vp) => vp.locationGroupId === activeLocationGroup.id
        );

        // Check if price is 0 (product not available)
        if (variantPrice && variantPrice.price === 0) {
          setIsProductAvailable(false);
          setCurrentLocationGroupData(null);

          // Even fallback has price 0, show as unavailable
          setSelectedLocationGroupId(activeLocationGroup.id);
          setLocationPrice({
            price: 0,
            mrp: variantPrice.mrp || 0,
          });

          const matchedLocation = activeLocationGroup.locations.find(
            (loc) => loc.pincode === fallbackPincode
          );
          const fallbackLocation = {
            city: matchedLocation?.city || "Delhi",
            state: matchedLocation?.state || "Delhi",
            country: "India",
            pincode: fallbackPincode,
          };
          localStorage.setItem(
            "locationData",
            JSON.stringify(fallbackLocation)
          );
          window.dispatchEvent(new Event("locationDataUpdated"));
          setIsCodAvailableForPincode(false);
          setDeliveryInfo({
            location: `${matchedLocation?.city || "Delhi"}, ${fallbackPincode}`,
            estimatedDelivery: 0,
            isCodAvailable: false,
          });
        } else {
          const matchedLocation = activeLocationGroup.locations.find(
            (loc) => loc.pincode === fallbackPincode
          );
          const fallbackLocation = {
            city: matchedLocation?.city || "Delhi",
            state: matchedLocation?.state || "Delhi",
            country: "India",
            pincode: fallbackPincode,
          };
          localStorage.setItem(
            "locationData",
            JSON.stringify(fallbackLocation)
          );
          window.dispatchEvent(new Event("locationDataUpdated"));
          setIsCodAvailableForPincode(activeLocationGroup.isCodAvailable);
          setDeliveryInfo({
            location: `${matchedLocation?.city || "Delhi"}, ${fallbackPincode}`,
            estimatedDelivery: activeLocationGroup.deliveryDays || 0,
            isCodAvailable: activeLocationGroup.isCodAvailable || false,
          });
        }
      }
    }

    if (activeLocationGroup) {
      const group = activeLocationGroup;
      const variantPrice = selectedVariant.variantPrices?.find(
        (vp) => vp.locationGroupId === group.id
      );

      // Only set default location group data if product is available
      if (variantPrice && variantPrice.price > 0) {
        setDefaultLocationGroupData(group);
        setSelectedLocationGroupId(group.id);
        setLocationPrice({
          price: variantPrice.price || 0,
          mrp: variantPrice.mrp || 0,
        });
        setIsProductAvailable(true);
        setCurrentLocationGroupData(group);
      } else {
        setIsProductAvailable(false);
        setCurrentLocationGroupData(null);
      }

      if (usedPincode) {
        setPincode(usedPincode);
      }
      setIsPincodeChecked(true);
    } else {
      console.error("No active location group found!");
      setIsCodAvailableForPincode(false);
      setDeliveryInfo(null);
      setIsProductAvailable(false);
      setIsPincodeChecked(false);
    }
  }, [
    locationGroups,
    selectedVariant,
    session,
    addresses,
    isAddressLoading,
    setDeliveryInfo,
    setIsCodAvailableForPincode,
    setLocationPrice,
    setSelectedLocationGroupId,
  ]);

  const handlePincodeCheck = () => {
    if (pincode.trim()) {
      const foundGroup = locationGroups.find((group) =>
        group.locations.some((loc) => loc.pincode === pincode.trim())
      );
      const foundLocation = foundGroup?.locations.find(
        (loc) => loc.pincode === pincode.trim()
      );

      if (foundGroup && foundLocation) {
        const variantPrice = selectedVariant.variantPrices?.find(
          (vp) => vp.locationGroupId === foundGroup.id
        );

        if (variantPrice) {
          setIsProductAvailable(true);
          setSelectedLocationGroupId(foundGroup.id);
          setLocationPrice({
            price: variantPrice.price || 0,
            mrp: variantPrice.mrp || 0,
          });
          setDeliveryInfo({
            location: `${foundLocation.city}, ${foundLocation.pincode}`,
            estimatedDelivery: foundGroup.deliveryDays || 0,
            isCodAvailable: foundGroup.isCodAvailable || false,
          });
          setIsCodAvailableForPincode(foundGroup.isCodAvailable);
          setCurrentLocationGroupData(foundGroup);
          const locationData = {
            city: foundLocation.city,
            state: foundLocation.state,
            country: foundLocation.country || "India",
            pincode: foundLocation.pincode,
          };
          localStorage.setItem("locationData", JSON.stringify(locationData));
          window.dispatchEvent(new Event("locationDataUpdated"));
        } else {
          // Fallback to 110040 if price not available
          const fallbackGroup = getFallbackGroup();
          let fallbackVariantPrice = null;
          if (fallbackGroup) {
            fallbackVariantPrice = selectedVariant.variantPrices?.find(
              (vp) => vp.locationGroupId === fallbackGroup.id
            );
          }

          setIsProductAvailable(false);
          setSelectedLocationGroupId(fallbackGroup?.id || null);
          setLocationPrice({
            price: fallbackVariantPrice?.price || 0,
            mrp: fallbackVariantPrice?.mrp || 0,
          });
          setDeliveryInfo({
            location: `Pincode ${pincode.trim()}`,
            estimatedDelivery: 0,
            isCodAvailable: false,
          });
          setIsCodAvailableForPincode(false);
          setCurrentLocationGroupData(null);
          const fallbackLocation = fallbackGroup
            ? {
                city: fallbackGroup.locations[0]?.city || "Delhi",
                state: fallbackGroup.locations[0]?.state || "Delhi",
                country: fallbackGroup.locations[0]?.country || "India",
                pincode: fallbackGroup.locations[0]?.pincode || "110040",
              }
            : null;
          if (fallbackLocation) {
            localStorage.setItem(
              "locationData",
              JSON.stringify(fallbackLocation)
            );
            window.dispatchEvent(new Event("locationDataUpdated"));
          }
        }
        setIsPincodeChecked(true);
      } else {
        // No group found, fallback to 110040
        const fallbackGroup = getFallbackGroup();
        let fallbackVariantPrice = null;
        if (fallbackGroup) {
          fallbackVariantPrice = selectedVariant.variantPrices?.find(
            (vp) => vp.locationGroupId === fallbackGroup.id
          );
        }

        setIsProductAvailable(false);
        setSelectedLocationGroupId(fallbackGroup?.id || null);
        setLocationPrice({
          price: fallbackVariantPrice?.price || 0,
          mrp: fallbackVariantPrice?.mrp || 0,
        });
        setDeliveryInfo({
          location: `Pincode ${pincode.trim()}`,
          estimatedDelivery: 0,
          isCodAvailable: false,
        });
        setIsCodAvailableForPincode(false);
        setCurrentLocationGroupData(null);
        const fallbackLocation = fallbackGroup
          ? {
              city: fallbackGroup.locations[0]?.city || "Delhi",
              state: fallbackGroup.locations[0]?.state || "Delhi",
              country: fallbackGroup.locations[0]?.country || "India",
              pincode: fallbackGroup.locations[0]?.pincode || "110040",
            }
          : null;
        if (fallbackLocation) {
          localStorage.setItem(
            "locationData",
            JSON.stringify(fallbackLocation)
          );
          window.dispatchEvent(new Event("locationDataUpdated"));
        }
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
    setCurrentLocationGroupData(null);
  };

  useEffect(() => {
    initializeDefaultPrice();
  }, [
    initializeDefaultPrice,
    addresses,
    isAddressLoading,
    locationGroups,
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
    const variant = allVariants.find(
      (v) => v.sizeId === selectedSizeId && v.colorId === selectedColorId
    );
    if (variant) {
      const fullVariant =
        productData.variant.id === variant.id ? productData.variant : null;
      if (fullVariant) {
        setSelectedVariant(fullVariant);
        onVariantChange?.(fullVariant);
      }
    }
  }, [
    selectedSizeId,
    selectedColorId,
    allVariants,
    productData,
    setSelectedVariant,
    onVariantChange,
  ]);

  const handleSizeChange = useCallback(
    (sizeId: string) => {
      setSelectedSizeId(sizeId);
      let availableColor =
        selectedColorId &&
        allVariants.find(
          (v) => v.sizeId === sizeId && v.colorId === selectedColorId
        )?.colorId;
      if (!availableColor) {
        availableColor = allVariants.find((v) => v.sizeId === sizeId)?.colorId;
      }
      if (availableColor) {
        setSelectedColorId(availableColor);
      }
    },
    [allVariants, selectedColorId]
  );

  useEffect(() => {
    if (isPincodeChecked && selectedLocationGroupId) {
      const variantPrice = selectedVariant.variantPrices?.find(
        (vp) => vp.locationGroupId === selectedLocationGroupId
      );
      setLocationPrice({
        price: variantPrice?.price || 0,
        mrp: variantPrice?.mrp || 0,
      });
    }
  }, [
    selectedVariant,
    selectedLocationGroupId,
    isPincodeChecked,
    setLocationPrice,
  ]);

  const handleColorChange = useCallback(
    (colorId: string) => {
      setSelectedColorId(colorId);
      let availableSize =
        selectedSizeId &&
        allVariants.find(
          (v) => v.colorId === colorId && v.sizeId === selectedSizeId
        )?.sizeId;
      if (!availableSize) {
        availableSize = allVariants.find((v) => v.colorId === colorId)?.sizeId;
      }
      if (availableSize) {
        setSelectedSizeId(availableSize);
      }
    },
    [allVariants, selectedSizeId]
  );

  const discountPercentage =
    locationPrice.mrp > 0
      ? Math.round(
          ((locationPrice.mrp - locationPrice.price) / locationPrice.mrp) * 100
        )
      : 0;

  const handleRatingClick = () => {
    if (reviewsRef?.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isLightColor = (hexColor: any) => {
    if (!hexColor) return false;

    if (
      hexColor === "white" ||
      hexColor === "#fff" ||
      hexColor === "#ffffff" ||
      hexColor === "#f7f7f7" ||
      hexColor === "#fdfcfc" ||
      hexColor === "White"
    )
      return true;

    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200; // Threshold for light colors
  };

  return (
    <div ref={divRef}>
      <div ref={containerRef} className="text-black bg-white">
        <div className="container mx-auto md:px-4 px-0 py-3 md:py-3">
          {/* <div
            onClick={onOpen}
            className={`flex items-center justify-end cursor-pointer gap-1 ${
              !product?.isNewArrival ? "pb-4" : "pb-0"
            }`}
          >
            <GoShareAndroid />
            <span className="text-sm">Share</span>
          </div> */}
          {product.isNewArrival && (
            <div className="text-black w-fit border border-[#434343] rounded-[16px] text-[12px] px-2 py-[2px] mb-3">
              New Arrival
            </div>
          )}

          <h1 className="text-lg md:text-xl font-medium">{variant.name}</h1>
          <Link
            href={`/brand/${product?.brand?.slug}?page=1`}
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
                  <span
                    className="text-gray-600 text-sm cursor-pointer hover:underline"
                    onClick={handleRatingClick}
                  >
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
                <span className="text-xl md:text-2xl font-semibold">
                  {formatter.format(locationPrice.price)}
                </span>
                {locationPrice.mrp > 0 && (
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
                EMI plans at just ₹{(locationPrice.price / 24).toFixed(0)}/mo*.
                See EMI Options
              </span>
            </div>
          </div>

          {(availableSizes.length > 0 || availableColors.length > 0) && (
            <div className="flex flex-col gap-y-1 mt-4 border-t border-b pt-[12px] pb-[12px] border-t-[#d9d9d9] border-b-[#d9d9d9]">
              {availableSizes.length > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-sm text-[#262626]">
                      Size
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(({ id, name }) => {
                      const isSelected = selectedSizeId === id;
                      const isAvailable = allVariants.some(
                        (v) => v.sizeId === id
                      );

                      return (
                        <button
                          key={id}
                          onClick={() =>
                            isAvailable && handleSizeChange(id as string)
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
                          {name || "Unknown"}
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
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map(({ id, name, value }) => {
                      const isSelected = selectedColorId === id;
                      const isAvailable = allVariants.some(
                        (v) => v.colorId === id
                      );

                      return (
                        <div
                          key={id}
                          className={cn(
                            "relative cursor-pointer transition-all duration-200",
                            !isAvailable && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() =>
                            isAvailable && handleColorChange(id as string)
                          }
                        >
                          <div
                            className={cn(
                              "w-[30px] h-[30px] rounded-full border-1 transition-all duration-200",
                              isSelected
                                ? "border-black ring-2 ring-black ring-offset-2"
                                : isLightColor(value)
                                ? "border-2 border-gray-500" // Stronger border for light colors
                                : "border-1 border-gray-300",
                              !isAvailable && "grayscale"
                            )}
                            style={{
                              backgroundColor: value || "#f3f4f6",
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

          <div className="mt-6 space-y-4">
            <div>
              <BankOffers />
            </div>
          </div>
          <div className="mt-4 border rounded-3xl p-4 bg-[#f6f4f4] ">
            {!isPincodeChecked && (
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
            )}

            {!isPincodeChecked ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter pincode"
                    className="flex-1 h-9 text-sm border-gray-300 focus:border-[#ee8c1d] "
                    maxLength={6}
                  />
                  <Button
                    variant="outline"
                    className="h-9 px-4 text-sm font-medium text-[#ee8c1d] border-[#ee8c1d] hover:bg-[#ee8c1d]"
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
                <div className="flex items-center justify-between gap-1">
                  <div>
                    <div className="flex items-center justify-between mb-[10px]">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isProductAvailable
                              ? "text-gray-900"
                              : "text-red-700"
                          )}
                        >
                          {isProductAvailable
                            ? `Deliver options ${deliveryInfo?.location}`
                            : `Product not available at ${pincode.trim()}`}
                        </span>
                      </div>
                    </div>

                    {deliveryInfo && isProductAvailable && (
                      <div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-800">
                            <span className="font-medium">
                              Express Delivery{" "}
                              {formatDeliveryDate(
                                deliveryInfo.estimatedDelivery
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-medium">
                            <span className="text-sm text-gray-800">
                              {isCodAvailableForPincode
                                ? "Cash on Delivery Available"
                                : "Cash on Delivery Not Available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleChangePincode}
                    className="h-9 px-4 text-sm font-medium text-[#ee8c1d] border-[#ee8c1d] hover:bg-[#ee8c1d]"
                  >
                    Change
                  </Button>
                </div>

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

          <ProductFeatures data={productData} />

          {product.expressDelivery &&
            currentLocationGroupData?.isExpressDelivery && (
              <p className="font-bold text-orange-500 text-2xl pt-6">
                {currentLocationGroupData.expressDeliveryText?.length > 0
                  ? currentLocationGroupData.expressDeliveryText
                  : "Express Delivery | Delhi NCR Only | Call Now +91-9540717161"}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
