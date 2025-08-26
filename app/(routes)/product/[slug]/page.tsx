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
  const product = await getProductBySlug(params.slug);

  if (!product || !product.variants[0]) {
    return {
      title: "Product Not Found",
      description: "The requested product is not available.",
    };
  }

  const firstVariant = product.variants[0];
  const previousImages = (await parent).openGraph?.images || [];

  const title =
    product.metaTitle || `Buy ${product.name} ${product.about || ""}`;
  const description = product.metaDescription || product.description;
  const keywords = product.metaKeywords?.length ? product.metaKeywords : [];
  const ogImage =
    product.openGraphImage ||
    firstVariant.images[0]?.url ||
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
  const product = await getProductBySlug(params.slug);

  if (!product || !product.variants.length) {
    redirect("/");
  }

  const productsData = await getProducts({
    categoryId: product?.category?.id,
    limit: "10",
  });
  const suggestProducts = productsData.products.filter(
    (item) => item.id !== product.id
  );

  const locationGroups = await getLocationGroups();

  return (
    <ProductPageContent
      product={product}
      suggestProducts={suggestProducts}
      locationGroups={locationGroups}
    />
  );
};

export default ProductPage;
