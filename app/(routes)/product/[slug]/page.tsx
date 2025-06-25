import { getProductBySlug } from "@/actions/get-product";
import { getProducts } from "@/actions/get-products";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { ProductPageContent } from "@/components/store/ProductPageClient";

interface ProductPageProps {
  params: { slug: string };
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

  return {
    title: `Buy ${product.name} ${product.about || ""}`,
    description: product.description,
    openGraph: {
      images: [
        {
          url: firstVariant.images[0]?.url || "/placeholder-image.jpg",
          height: 1200,
          width: 900,
        },
        ...previousImages,
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Buy ${product.name} ${product.about || ""}`,
      description: product.description,
      images: [
        {
          url: firstVariant.images[0]?.url || "/placeholder-image.jpg",
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

  const suggestProducts = (
    await getProducts({
      categoryId: product?.category?.id,
      limit: "10",
    })
  ).filter((item) => item.id !== product.id);

  return (
    <ProductPageContent product={product} suggestProducts={suggestProducts} />
  );
};

export default ProductPage;
