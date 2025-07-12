import { getBrandBySlug } from "@/actions/get-brand";
import { getProducts } from "@/actions/get-products";
import { getColors } from "@/actions/get-colors";
import { getSizes } from "@/actions/get-sizes";
import { getLocations } from "@/actions/get-locations";
import { Container } from "@/components/ui/container";
import { Filter } from "./[_components]/filter";
import { NoResults } from "@/components/store/no-results";
import { ProductCard } from "@/components/store/product-card";
import { MobileFilters } from "./[_components]/mobile-filters";
import { PaginationComponent } from "./[_components]/pagination";
import { Metadata, ResolvingMetadata } from "next";
import { PriceRange, Location } from "@/types";
import Image from "next/image";
import Breadcrumb from "@/components/store/Breadcrumbs";

interface BrandPageProps {
  params: {
    storeId: string;
    slug: string;
  };
  searchParams: {
    colorId?: string;
    sizeId?: string;
    limit?: string;
    category?: "MEN" | "WOMEN";
    page?: string;
    price?: string;
    locationId?: string;
  };
}

export async function generateMetadata(
  { params, searchParams }: BrandPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const brand = await getBrandBySlug(params.slug);
  const previousImages = (await parent).openGraph?.images || [];
  //   const location = await getLocations()

  if (!brand) {
    return {
      title: "Brand Not Found",
      description: "The requested brand does not exist.",
    };
  }

  const categoryName = searchParams.category
    ? `${
        searchParams.category[0].toUpperCase() +
        searchParams.category.slice(1).toLowerCase()
      }'s`
    : "";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001"
    ),
    title: `Buy ${brand.name} Products Online | Get Deals, Shop Now!`,
    description: `Discover the latest styles & trends from ${brand.name}. Shop ${brand.name} products.`,
    openGraph: {
      images: [brand.cardImage || "/placeholder-image.jpg", ...previousImages],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Buy ${brand.name} Products Online | Get Deals, Shop Now!`,
      description: `Discover the latest styles & trends from ${brand.name}. Shop ${categoryName} ${brand.name} products.`,
      images: [brand.cardImage || "/placeholder-image.jpg"],
    },
    category: "ecommerce",
  };
}

const BrandPage = async ({ params, searchParams }: BrandPageProps) => {
  const brand = await getBrandBySlug(params.slug);

  if (!brand) {
    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-24">
            <NoResults />
          </div>
        </Container>
      </div>
    );
  }

  const products = await getProducts({
    brandId: brand.id,
    type: searchParams.category,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
    page: searchParams.page || "1",
    price: searchParams.price,
    limit: "12",
    // locationId: searchParams.locationId,
  });

  const sizes = await getSizes();
  const colors = await getColors();
  const locations = await getLocations(params.storeId);

  const sizeMap: { [key: string]: string[] } = {
    TOPWEAR: ["S", "M", "L", "XL", "XXL"],
    BOTTOMWEAR: ["S", "M", "L", "XL", "XXL"],
    FOOTWEAR: ["6", "7", "8", "9", "10", "11"],
    INNERWEARANDSLEEPWEAR: ["S", "M", "L", "XL"],
    MAKEUP: [],
    SKINCARE: [],
    HAIRCARE: [],
    FRAGRANCES: [],
    TELEVISION: [],
  };

  // Use first product's category classification or default to TOPWEAR
  const classification = products[0]?.category?.classification || "TOPWEAR";
  const validSizes = sizeMap[classification] || [];
  const filteredSizes = sizes.filter((size) => validSizes.includes(size.name));

  const priceRange: PriceRange[] = [
    { id: "0-500", name: "Rs. 0 to Rs. 500", value: "0-500" },
    { id: "500-1500", name: "Rs. 500 to Rs. 1500", value: "500-1500" },
    { id: "1500-3000", name: "Rs. 1500 to Rs. 3000", value: "1500-3000" },
    { id: "3000-5000", name: "Rs. 3000 to Rs. 5000", value: "3000-5000" },
    { id: "5000", name: "Above Rs. 5000", value: "5000" },
  ];

  const breadcrumbItems = [
    {
      label: brand.name,
      href: `/brand/${brand.slug}?page=1`,
    },
  ];

  return (
    <div className="bg-white">
      <Breadcrumb items={breadcrumbItems} />
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src={brand.bannerImage || "/placeholder-image.jpg"}
          alt={`${brand.name} Banner`}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md">
            {brand.name || "Explore Brand"}
          </h1>
        </div>
      </div>
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8 mt-14">
            <MobileFilters sizes={filteredSizes} colors={colors} />
            <div className="hidden lg:block lg:border-r">
              <h3 className="mb-5 text-lg font-bold">Filters</h3>
              <Filter valueKey="sizeId" name="Sizes" data={filteredSizes} />
              <Filter valueKey="colorId" name="Colors" data={colors} />
              <Filter valueKey="price" name="Price" data={priceRange} />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-4">
              {products.length === 0 ? (
                <NoResults />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      data={product}
                      locations={locations}
                    />
                  ))}
                </div>
              )}
              <div className="w-full flex items-center justify-center pt-12">
                <PaginationComponent lastPage={products.length < 12} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BrandPage;
