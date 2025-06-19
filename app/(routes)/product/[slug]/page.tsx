import { getProductBySlug } from "@/actions/get-product";
import { getProducts } from "@/actions/get-products";
import { Gallery } from "@/components/gallery";
import { ProductDetails } from "@/components/store/product-details";
import { ProductList } from "@/components/store/product-list";
import { Container } from "@/components/ui/container";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { ProductReviews } from "@/components/store/product-reviews";
import { ProductDescription } from "@/components/store/productDescription";
import { ProductBadges } from "@/components/store/productBadges";
import { ProductTabs } from "@/components/store/prodcutTabs";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Buy ${product.name} ${product.about}`,
    description: `${product.description}`,
    openGraph: {
      images: [
        {
          url: product.productImages[0].url,
          height: 1200,
          width: 900,
        },
        ...previousImages,
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Buy ${product.name} ${product.about}`,
      description: `${product.description}`,
      images: [
        {
          url: product.productImages[0].url,
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

  if (!product) {
    redirect("/");
  }

  const suggestProducts = (
    await getProducts({
      categoryId: product?.category?.id,
      limit: "10",
      // type : product.type.toString()
    })
  ).filter((item) => item.id !== product.id);

  return (
    <div className="bg-white text-black mb-16">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-5">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <div>
              <Gallery images={product.productImages} />
            </div>
            <div className="mt-10 sm:mt-16 lg:mt-0 md:px-24 lg:px-0 flex flex-col gap-y-5">
              <ProductDetails data={product} />
              <ProductBadges />
              <ProductReviews productId={product.id} />
            </div>
          </div>
        </div>
        <hr className="md:m-10 md:my-2 mx-10" />
        <div className="flex flex-col gap-y-5 md:gap-y-8 px-4 sm:px-6 lg:px-8">
          {/* <ProductDescription data={product} /> */}
          <ProductTabs product={product} productId={product.id} />
          <ProductList title="Similar Products" data={suggestProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
