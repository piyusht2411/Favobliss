import { getHotDeals, getProducts } from "@/actions/get-products";
import { getLocations } from "@/actions/get-locations"; // New import
import HeroSlider from "@/components/store/billboard";
import { HotDealBanner } from "@/components/store/hotDealBanner";
import { LatestLaunches } from "@/components/store/latestLaunches";
import { ProductList } from "@/components/store/product-list";
import { Container } from "@/components/ui/container";
import { CategorySlider } from "@/components/home/category-slider";
import HotDealSlider from "@/components/store/hotDealSlider";
import GalleryImage from "@/components/store/GalleryImage";

export const revalidate = 0;

const LandingPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await getProducts({ isFeatured: true });
  const deals = await getHotDeals({
    limit: "10",
    timeFrame: "30 days",
  });

  const locations = await getLocations(params.storeId);

  return (
    <>
      <HeroSlider />
      <CategorySlider />
      <GalleryImage />
      <Container>
        <div className="space-y-10 pb-20 mt-20">
          <div className="flex flex-col gap-y-12 md:gap-y-20 px-4 sm:px-6 lg:px-8">
            <HotDealBanner />
            <ProductList
              title="Latest Launches"
              data={products}
              locations={locations}
            />
            <ProductList
              title="Hot Deals Products"
              data={deals || []}
              locations={locations}
            />
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
