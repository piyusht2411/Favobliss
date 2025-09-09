import { getProductBySlug } from "@/actions/get-product";
import { getProducts } from "@/actions/get-products";
import { getLocationGroups } from "@/actions/get-location-group";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { ProductPageContent } from "@/components/store/ProductPageClient";

interface ProductPageProps {
  params: { storeId: string; slug: string };
}

export const revalidate = 60; 

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productData = await getProductBySlug(params.slug);

  if (!productData || !productData.variant) {
    return {
      title: "Product Not Found",
      description: "The requested product is not available.",
    };
  }

  const { variant } = productData;
  const previousImages = (await parent).openGraph?.images || [];

  const title = variant.metaTitle || `Buy ${variant.name}`;
  const description = variant.metaDescription || variant.description;
  const keywords = variant.metaKeywords?.length ? variant.metaKeywords : [];
  const ogImage =
    variant.openGraphImage ||
    variant.images[0]?.url ||
    "/placeholder-image.jpg";

  return {
    title,
    description,
    keywords,
    openGraph: {
      images: [
        {
          url: ogImage,
          height: 1200,
          width: 900,
        },
        ...previousImages,
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImage,
          height: 1200,
          width: 900,
        },
      ],
    },
    category: "ecommerce",
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  // Parallelize fetches
  const [productData, productsData, locationGroups] = await Promise.all([
    getProductBySlug(params.slug),
    getProducts({
      categoryId: "", // Set dynamically below
      limit: "10",
    }).catch(() => ({ products: [] })), // Fallback for robustness
    getLocationGroups().catch(() => []), // Fallback
  ]);

  if (!productData || !productData.variant || !productData.allVariants.length) {
    redirect("/");
  }


  const productsDataWithCategory = productData.product?.category?.id
    ? await getProducts({
        categoryId: productData.product.category.id,
        limit: "10",
      }).catch(() => ({ products: [] }))
    : { products: [] };

  const suggestProducts = productsDataWithCategory.products.filter(
    (item) => item.id !== productData.product.id
  );

  return (
    <ProductPageContent
      productData={productData}
      suggestProducts={suggestProducts}
      locationGroups={locationGroups}
    />
  );
};

export default ProductPage;
