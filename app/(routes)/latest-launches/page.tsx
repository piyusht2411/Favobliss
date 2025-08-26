import { getColors } from "@/actions/get-colors";
import { getProducts } from "@/actions/get-products";
import { getSizes } from "@/actions/get-sizes";
import { getLocations } from "@/actions/get-locations";
import { Container } from "@/components/ui/container";
import { Filter } from "./_components/filter";
import { NoResults } from "@/components/store/no-results";
import { ProductCard } from "@/components/store/product-card";
import { MobileFilters } from "./_components/mobile-filters";
import { PaginationComponent } from "./_components/pagination";
import { Metadata, ResolvingMetadata } from "next";
import { PriceRange, Location } from "@/types";
import Image from "next/image";
import Breadcrumb from "@/components/store/Breadcrumbs";
import { getSubCategoryBySlug } from "@/actions/get-subcategory";
import { getLocationGroups } from "@/actions/get-location-group";

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 100
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

interface CategoryPageProps {
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
    sub?: string;
    childsub?: string;
  };
}

// export async function generateMetadata(
//   { params, searchParams }: CategoryPageProps,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   // Fetch data with retry
//   const category = await withRetry(() => getCategoryBySlug(params.slug));
//   const subCategory = searchParams.sub
//     ? await withRetry(() => getSubCategoryBySlug(searchParams.sub as string))
//     : null;
//   const childSubCategory = searchParams.childsub
//     ? await withRetry(() =>
//         getSubCategoryBySlug(searchParams.childsub as string)
//       )
//     : null;

//   const previousImages = (await parent).openGraph?.images || [];

//   const currentEntity = childSubCategory || subCategory || category;
//   if (!currentEntity) {
//     return {
//       title: "Category Not Found",
//       description: "The requested category does not exist.",
//     };
//   }

//   const categoryName = searchParams.category
//     ? `${searchParams.category[0].toUpperCase()}${searchParams.category
//         .slice(1)
//         .toLowerCase()}'s`
//     : "";

//   return {
//     title: `Buy ${categoryName} ${currentEntity.name} Online | Get Deals, Shop Now!`,
//     description: `Dress to impress: Latest styles & trends for every occasion. Shop ${categoryName} ${currentEntity.name}`,
//     openGraph: {
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `Buy ${categoryName} ${currentEntity.name} Online | Get Deals, Shop Now!`,
//       description: `Dress to impress: Latest styles & trends for every occasion. Shop ${categoryName} ${currentEntity.name}`,
//     },
//     category: "ecommerce",
//   };
// }

const LatestLaunches = async ({ params, searchParams }: CategoryPageProps) => {
  const page = searchParams.page || "1";
  const limit = "12";
  const query = {
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
    price: searchParams.price,
    page,
    limit,
  };
  const { products, totalCount } = await withRetry(() => getProducts(query));

  const sizes = await withRetry(() => getSizes());
  const colors = await withRetry(() => getColors());
  const locationGroups = await withRetry(() => getLocationGroups());

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

  const priceRange: PriceRange[] = [
    { id: "0-500", name: "Rs. 0 to Rs. 500", value: "0-500" },
    { id: "500-1500", name: "Rs. 500 to Rs. 1500", value: "500-1500" },
    { id: "1500-3000", name: "Rs. 1500 to Rs. 3000", value: "1500-3000" },
    { id: "3000-5000", name: "Rs. 3000 to Rs. 5000", value: "3000-5000" },
    { id: "5000", name: "Above Rs. 5000", value: "5000" },
  ];

  const totalPages = Math.ceil(totalCount / parseInt(limit));

  return (
    <div className="bg-white">
      {/* <Breadcrumb items={breadcrumbItems} /> */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dgcksrb1n/image/upload/v1749465423/qoujpnmfjabip1yrllvs.jpg"
          alt={`Banner`}
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md">
            Latest Launches
          </h1>
        </div>
      </div>
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8 mt-14">
            <MobileFilters sizes={sizes} colors={colors} />
            <div className="hidden lg:block lg:border-r">
              <h3 className="mb-5 text-lg font-bold">Filters</h3>
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
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
                      locationGroups={locationGroups}
                    />
                  ))}
                </div>
              )}
              <div className="w-full flex items-center justify-center pt-12">
                <PaginationComponent
                  currentPage={parseInt(page)}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LatestLaunches;
