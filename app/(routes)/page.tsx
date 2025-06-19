import { getCategories } from "@/actions/get-categories";
import { getHotDeals, getProducts } from "@/actions/get-products";
import HeroSlider from "@/components/store/billboard";
import { HotDealBanner } from "@/components/store/hotDealBanner";
import { LatestLaunches } from "@/components/store/latestLaunches";
import { ProductList } from "@/components/store/product-list";
import { Container } from "@/components/ui/container";
import { CategorySlider } from "@/components/home/category-slider";
import { Bank } from "@/components/home/bank";
import HotDealSlider from "@/components/store/hotDealSlider";
import GalleryImage from "@/components/store/GalleryImage";
import { CategoryList } from "@/components/store/category-list";

export const revalidate = 0;

const LandingPage = async () => {
  const products = await getProducts({ isFeatured: true });
  const deals = await getHotDeals({
    limit: "10",
    timeFrame: "30 days",
  });

  return (
    <>
      <HeroSlider />
      <CategorySlider />
      {/* <Bank /> */}
      <GalleryImage />
      <Container>
        <div className="space-y-10 pb-20 mt-20">
          <div className="flex flex-col gap-y-12 md:gap-y-20 px-4 sm:px-6 lg:px-8">
            {/* <CategoryList categories={categories} /> */}
            <HotDealBanner />
            <ProductList title="Latest Launches" data={products} />
            <ProductList title="Hot Deals Products" data={deals || []} />
            <LatestLaunches />
            <div className="pt-8 ">
              <h3 className="text-3xl font-bold">Hot Deals</h3>
            </div>
            <HotDealSlider />
          </div>
        </div>
      </Container>
    </>
  );
};

export default LandingPage;
