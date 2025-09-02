// // ModalProductDetails.tsx
// "use client";

// import { Product } from "@/types";
// import { formatter } from "@/lib/utils";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { HiShoppingBag } from "react-icons/hi";
// import { useCart } from "@/hooks/use-cart";
// import { WishlistButton } from "./wishlist-button";
// import { useState } from "react";

// interface ModalProductDetailsProps {
//   data: Product;
//   selectedVariantIndex: number;
//   onVariantChange: (index: number) => void;
// }

// export const ModalProductDetails = ({
//   data,
//   selectedVariantIndex,
//   onVariantChange,
// }: ModalProductDetailsProps) => {
//   const { addItem } = useCart();

//   const selectedVariant =
//     data.variants?.[selectedVariantIndex] || data.variants?.[0] || null;

//   const onHandleCart = async () => {
//     if (selectedVariant) {
//       // addItem({
//       //   ...data,
//       //   checkOutQuantity: 1,
//       //   selectedVariant,
//       //   pincode: "247001",
//       //   deliveryDays: 0,
//       // });
//     }
//   };

//   // Get unique colors and sizes
//   const uniqueColors = data.variants.reduce((acc, variant) => {
//     if (
//       !acc.find(
//         (color) => color && variant.color && color.id === variant.color.id
//       )
//     ) {
//       acc.push(variant.color);
//     }
//     return acc;
//   }, [] as (typeof data.variants)[0]["color"][]);

//   const uniqueSizes = data.variants.reduce((acc, variant) => {
//     if (
//       !acc.find((size) => size && variant.size && size.id === variant.size.id)
//     ) {
//       acc.push(variant.size);
//     }
//     return acc;
//   }, [] as (typeof data.variants)[0]["size"][]);

//   const handleColorChange = (colorId: string) => {
//     const variantIndex = data.variants.findIndex(
//       (v) => v.color && v.color.id === colorId
//     );
//     if (variantIndex !== -1) {
//       onVariantChange(variantIndex);
//     }
//   };

//   const handleSizeChange = (sizeId: string) => {
//     const currentColor = selectedVariant?.color?.id;
//     const variantIndex = data.variants.findIndex(
//       (v) =>
//         v.size && v.size.id === sizeId && v.color && v.color.id === currentColor
//     );
//     if (variantIndex !== -1) {
//       onVariantChange(variantIndex);
//     } else {
//       const fallbackIndex = data.variants.findIndex(
//         (v) => v.size && v.size.id === sizeId
//       );
//       if (fallbackIndex !== -1) {
//         onVariantChange(fallbackIndex);
//       }
//     }
//   };

//   const mrpDisplay =
//     selectedVariant?.mrp && selectedVariant.mrp !== selectedVariant.price
//       ? formatter.format(selectedVariant.mrp)
//       : null;

//   const discountPercentage =
//     selectedVariant?.mrp && selectedVariant.mrp !== selectedVariant.price
//       ? Math.round(
//           ((selectedVariant.mrp - selectedVariant.price) /
//             selectedVariant.mrp) *
//             100
//         )
//       : null;

//   return (
//     <div className="mt-4">
//       <h1 className="text-2xl text-zinc-800 font-bold line-clamp-2">
//         {data.name}
//       </h1>
//       <p className="text-zinc-600 font-semibold mt-2 line-clamp-2">
//         {data.about}
//       </p>

//       {/* Brand */}
//       {data.brand && (
//         <p className="text-sm text-zinc-500 font-medium mt-1">
//           by{" "}
//           {typeof data.brand === "object" && "name" in data.brand
//             ? data.brand.name
//             : data.brand}
//         </p>
//       )}

//       {/* Price Section */}
//       <div className="flex items-end mt-6 justify-between">
//         <Alert className="border-none p-0">
//           <div className="flex items-center gap-3">
//             <AlertTitle className="text-2xl font-bold text-zinc-900">
//               {selectedVariant
//                 ? formatter.format(selectedVariant.price)
//                 : "Price unavailable"}
//             </AlertTitle>
//             {mrpDisplay && (
//               <>
//                 <span className="text-lg text-zinc-500 line-through">
//                   {mrpDisplay}
//                 </span>
//                 {discountPercentage && (
//                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
//                     {discountPercentage}% OFF
//                   </span>
//                 )}
//               </>
//             )}
//           </div>
//           <AlertDescription className="text-sm font-bold text-emerald-500 mt-1">
//             inclusive of all taxes
//           </AlertDescription>
//         </Alert>
//       </div>

//       {/* Stock Status */}
//       {selectedVariant && (
//         <div className="mt-4">
//           {selectedVariant.stock <= 0 ? (
//             <div className="text-red-600 font-medium text-sm">Out of Stock</div>
//           ) : selectedVariant.stock <= 5 ? (
//             <div className="text-orange-600 font-medium text-sm">
//               Only {selectedVariant.stock} left in stock
//             </div>
//           ) : (
//             <div className="text-green-600 font-medium text-sm">In Stock</div>
//           )}
//         </div>
//       )}

//       {/* Color Options */}
//       {uniqueColors.length > 1 && (
//         <div className="flex items-center gap-x-4 mt-6">
//           <h4 className="font-semibold text-black">Color</h4>
//           <div className="flex gap-2">
//             {uniqueColors.map((color) => {
//               if (!color) return null;
//               const isSelected = selectedVariant?.color?.id === color.id;
//               return (
//                 <button
//                   key={color.id}
//                   onClick={() => handleColorChange(color.id)}
//                   className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
//                     isSelected
//                       ? "border-zinc-800 scale-110"
//                       : "border-zinc-300 hover:border-zinc-400"
//                   }`}
//                   style={{ backgroundColor: color.value }}
//                   title={color.name}
//                 />
//               );
//             })}
//           </div>
//           <span className="text-sm text-zinc-600">
//             {selectedVariant?.color?.name}
//           </span>
//         </div>
//       )}

//       {/* Size Options */}
//       <div className="flex items-center gap-x-4 mt-6">
//         <h4 className="font-semibold text-black">Size</h4>
//         {uniqueSizes.length > 1 ? (
//           <div className="flex gap-2 flex-wrap">
//             {uniqueSizes.map((size) => {
//               if (!size) return null;
//               const isSelected = selectedVariant?.size?.id === size.id;
//               const isAvailable = data.variants.some(
//                 (v) => v.size && v.size.id === size.id && v.stock > 0
//               );
//               return (
//                 <button
//                   key={size.id}
//                   onClick={() => handleSizeChange(size.id)}
//                   disabled={!isAvailable}
//                   className={`px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
//                     isSelected
//                       ? "border-zinc-800 bg-zinc-800 text-white"
//                       : isAvailable
//                       ? "border-zinc-300 text-zinc-600 hover:border-zinc-400"
//                       : "border-zinc-200 text-zinc-400 cursor-not-allowed"
//                   }`}
//                 >
//                   {size.value}
//                 </button>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="flex items-center justify-center h-10 px-3 py-2 rounded-md border text-sm font-semibold text-zinc-800 bg-zinc-50">
//             {selectedVariant?.size?.value || "Size unavailable"}
//           </div>
//         )}
//       </div>

//       {/* SKU */}
//       {/* {selectedVariant?.sku && ( */}
//       <div className="mt-4 text-sm text-zinc-500">
//         {/* SKU: {selectedVariant.sku} */}
//       </div>
//       {/* )} */}

//       {/* Action Buttons */}
//       <div className="mt-16 grid grid-cols-2 max-w-sm gap-x-4">
//         <Button
//           className="w-full h-14 font-bold"
//           onClick={onHandleCart}
//           disabled={!selectedVariant || selectedVariant.stock <= 0}
//         >
//           <HiShoppingBag className="mr-4 h-6 w-6" />
//           {selectedVariant && selectedVariant.stock <= 0
//             ? "OUT OF STOCK"
//             : "ADD TO BAG"}
//         </Button>
//         <WishlistButton productId={data.id} />
//       </div>
//     </div>
//   );
// };

import { Product } from "@/types";
import React from "react";

interface ModalProductDetailsProps {
  data: Product;
  selectedVariantIndex: number;
  onVariantChange: (index: number) => void;
}

export const ModalProductDetails = (props: ModalProductDetailsProps) => {
  return <div>modal-product-details</div>;
};
