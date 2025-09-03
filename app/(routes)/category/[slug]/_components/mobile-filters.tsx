"use client";
import { Button } from "@/components/ui/button";
import { Color, PriceRange, Size, Brand } from "@/types";
import { ListFilter } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Filter } from "./filter";
import { useFilter } from "@/hooks/use-filter";

interface MobileFiltersProps {
  sizes: Size[];
  colors: Color[];
  brands: Brand[];
  priceRanges: PriceRange[];
  ratingRanges: { id: string; name: string; value: string }[];
  discountRanges: { id: string; name: string; value: string }[];
}

export const MobileFilters = ({
  sizes,
  colors,
  brands,
  priceRanges,
  ratingRanges,
  discountRanges,
}: MobileFiltersProps) => {
  const { isOpen, onChange } = useFilter();

  return (
    <Drawer open={isOpen} onOpenChange={onChange}>
      <DrawerTrigger className="lg:hidden" asChild>
        <Button variant="outline" onClick={() => onChange(true)}>
          <ListFilter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full sm:px-20">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 max-h-[60vh] overflow-y-auto">
          {/* <Filter valueKey="sizeId" name="Sizes" data={sizes} /> */}
          <Filter valueKey="colorId" name="Colors" data={colors} />
          <Filter valueKey="price" name="Price" data={priceRanges} />
          <Filter valueKey="brandId" name="Brands" data={brands} />
          <Filter valueKey="rating" name="Ratings" data={ratingRanges} />
          <Filter valueKey="discount" name="Discount" data={discountRanges} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
