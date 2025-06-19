import { getCategoryBySlug } from "@/actions/get-category";
import { getColors } from "@/actions/get-colors";
import { getProducts } from "@/actions/get-products";
import { getSizes } from "@/actions/get-sizes";
import { Container } from "@/components/ui/container";
import { Filter } from "./_components/filter";
import { NoResults } from "@/components/store/no-results";
import { ProductCard } from "@/components/store/product-card";
import { MobileFilters } from "./_components/mobile-filters";
import { PaginationComponent } from "./_components/pagination";
import { Metadata, ResolvingMetadata } from "next";
import { PriceRange } from "@/types";
import Image from "next/image";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    colorId?: string;
    sizeId?: string;
    limit?: string;
    category?: "MEN" | "WOMEN";
    page?: string;
    price?: string;
  };
}

export async function generateMetadata(
  { params, searchParams }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  const previousImages = (await parent).openGraph?.images || [];

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category does not exist.",
    };
  }

  const categoryName = searchParams.category
    ? `${
        searchParams.category[0].toUpperCase() +
        searchParams.category.slice(1).toLowerCase()
      }'s`
    : "";

  return {
    title: `Buy ${
      searchParams.category
        ? searchParams.category[0].toUpperCase() +
          searchParams.category.slice(1).toLowerCase() +
          "'s"
        : ""
    } ${category.name} Online | Get Deals, Shop Now!`,
    description: `Dress to impress: Latest styles & trends for every occasion. Shop ${
      searchParams.category
        ? searchParams.category[0].toUpperCase() +
          searchParams.category.slice(1).toLowerCase() +
          "'s"
        : ""
    } ${category.name}`,
    openGraph: {
      images: [category.billboardId.imageUrl, ...previousImages],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Buy ${
        searchParams.category
          ? searchParams.category[0].toUpperCase() +
            searchParams.category.slice(1).toLowerCase() +
            "'s"
          : ""
      } ${category.name} Online | Get Deals, Shop Now!`,
      description: `Dress to impress: Latest styles & trends for every occasion. Shop ${
        searchParams.category
          ? searchParams.category[0].toUpperCase() +
            searchParams.category.slice(1).toLowerCase() +
            "'s"
          : ""
      } ${category.name}`,
      images: [category.billboardId.imageUrl],
    },
    category: "ecommerce",
  };
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
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
    type: searchParams.category,
    categoryId: category.id,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
    page: searchParams.page || "1",
    price: searchParams.price,
    limit: "12",
  });

  const sizes = await getSizes();
  const colors = await getColors();

  // Map category classification to valid sizes
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

  const validSizes = sizeMap[category.classification] || [];
  const filteredSizes = sizes.filter((size) => validSizes.includes(size.name));

  const priceRange: PriceRange[] = [
    { id: "0-500", name: "Rs. 0 to Rs. 500", value: "0-500" },
    { id: "500-1500", name: "Rs. 500 to Rs. 1500", value: "500-1500" },
    { id: "1500-3000", name: "Rs. 1500 to Rs. 3000", value: "1500-3000" },
    { id: "3000-5000", name: "Rs. 3000 to Rs. 5000", value: "3000-5000" },
    { id: "5000", name: "Above Rs. 5000", value: "5000" },
  ];

  return (
    <div className="bg-white">
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src={category.bannerImage}
          alt="Exciting Deals Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md">
            {category.name || "Exciting Deals"}
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
                    <ProductCard key={product.id} data={product} />
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

export default CategoryPage;
