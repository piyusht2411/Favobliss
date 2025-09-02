import { getProductBySlug } from "@/actions/get-product";
import { getProducts } from "@/actions/get-products";
import { getLocations } from "@/actions/get-locations";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { ProductPageContent } from "@/components/store/ProductPageClient";
import { getLocationGroups } from "@/actions/get-location-group";

interface ProductPageProps {
  params: { storeId: string; slug: string };
}

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
  const ogImage = variant.openGraphImage || variant.images[0]?.url || "/placeholder-image.jpg";

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
  const productData = await getProductBySlug(params.slug);

  if (!productData || !productData.variant || !productData.allVariants.length) {
    redirect("/");
  }

  const productsData = await getProducts({
    categoryId: productData.product?.category?.id,
    limit: "10",
  });
  const suggestProducts = productsData.products.filter(
    (item) => item.id !== productData.product.id
  );

  const locationGroups = await getLocationGroups();

  return (
    <ProductPageContent
      productData={productData}
      suggestProducts={suggestProducts}
      locationGroups={locationGroups}
    />
  );
};

export default ProductPage;