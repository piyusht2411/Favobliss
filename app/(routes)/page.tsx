import { getHotDeals, getProducts } from "@/actions/get-products";
import HeroSlider from "@/components/store/billboard";
import { HotDealBanner } from "@/components/store/hotDealBanner";
import { LatestLaunches } from "@/components/store/latestLaunches";
import { ProductList } from "@/components/store/product-list";
import { Container } from "@/components/ui/container";
import { CategorySlider } from "@/components/home/category-slider";
import HotDealSlider from "@/components/store/hotDealSlider";
import GalleryImage from "@/components/store/GalleryImage";
import { getBrands } from "@/actions/get-brands";
import BrandList from "@/components/store/BrandList";
import BestOfProduct from "@/components/store/BestOfProducts";
import backtoSchoolImage from "@/public/assets/back-to-school.png";
import Image from "next/image";
import OfferImage from "@/components/store/OfferImage";
import { getCategories } from "@/actions/get-categories";
import LandingPageSection from "@/components/LandingPageSection";
import { AnyAaaaRecord } from "node:dns";
import {
  applianceItems,
  kitchenAppliance,
  premiumProducts,
} from "@/utils/constant";
import PremiumProductsSection from "@/components/PremiumProductSection";
import FourImageGrid from "@/components/store/FourImageGrid";
import FeatureHighlights from "@/components/store/FeatureHighlights";
import PromotionalBanner from "@/components/store/PromotionalBanner";
import { getSubCategories } from "@/actions/get-subcategory";
import RecentlyViewed from "@/components/store/RecentlyViewed";
import { getLocationGroups } from "@/actions/get-location-group";
import HomeAppliance from "@/components/store/HomeAppliance";

export const revalidate = 0;

const LandingPage = async ({ params }: { params: { storeId: string } }) => {
  const { products } = await getProducts();
  const { products: homeApplicance } = await getProducts({
    categoryId: "6843219ac338ba8cc9db1e72",
  });
  const brandCategory = await getSubCategories("6843219ac338ba8cc9db1e72");
  const deals = await getHotDeals({
    limit: "10",
    timeFrame: "30 days",
  });

  const { products: favoblissChoice } = await getProducts({ isFeatured: true });
  const categories = await getCategories();
  const locationGroups = await getLocationGroups(params.storeId);
  const brands = await getBrands();
  const { products: brandProducts } = await getProducts({
    brandId: "687247fbfefe791c5521f384",
  });

  const laptops = products.filter((product) => {
    const name = product.subCategory?.name?.toLowerCase();
    return name === "laptops" || name === "printers" || name === "desktop pcs";
  });

  const washingMachines = products.filter(
    (product) => product.category?.name?.toLowerCase() === "washing machine"
  );

  const kitchen = products.filter(
    (product) => product.category?.name?.toLowerCase() === "kitchen appliances"
  );

  return (
    <div className="bg-[#f8f8f8]">
      <HeroSlider />
      <CategorySlider categories={categories} />
      <GalleryImage />
      <Container>
        <div className="space-y-10 pb-20 mt-20">
          <div className="flex flex-col gap-y-8 md:gap-y-12 px-4 sm:px-6 lg:px-8">
            <RecentlyViewed locationGroups={locationGroups} />
            <ProductList
              title="Latest Launches"
              data={products}
              locationGroups={locationGroups}
              showViewAll={true}
              link="/latest-launches?page=1"
            />
            <PromotionalBanner
              data={favoblissChoice}
              locationGroups={locationGroups}
              categories={brandCategory}
            />
            <FourImageGrid />
            {/* <div className="space-y-4 md:space-y-16">
              <Image
                src="/assets/banner.jpg"
                alt="Image"
                width={1500}
                height={300}
                className="object-cover bg-blend-color-burn"
              />
            </div> */}
            {/* <LandingPageSection
              title="Home Appliances"
              items={applianceItems}
              viewAllLink="/category/home-appliances?page=1"
              className="mx-auto bg-[#d8d8d8]"
            />
            <ProductList
              title=""
              data={homeApplicance || []}
              locationGroups={locationGroups}
            /> */}
            <HomeAppliance
              title="Home Appliances"
              categoryId="6843219ac338ba8cc9db1e72"
              locationGroups={locationGroups}
              link="/category/home-appliances?page=1"
              items={applianceItems}
            />
            <HomeAppliance
              title="Kitchen Appliances"
              categoryId="684321aac338ba8cc9db1e73"
              locationGroups={locationGroups}
              link="/category/kitchen-appliances?page=1"
              items={kitchenAppliance}
            />
            {/* <LandingPageSection
              title="Kitchen Appliances"
              items={kitchenAppliance}
              viewAllLink="/category/kitchen-appliances?page=1"
              className="mx-auto bg-[#b8e0ee]"
            />
            <ProductList
              title=""
              data={kitchen || []}
              locationGroups={locationGroups}
            /> */}
            {/* <BestOfProduct
              products={brandProducts || []}
              title="Best of Apple"
              subtitle="Save up to ₹10,000 instantly on eligible products using ICICI, Axis or Kotak Mahindra Bank Credit Cards | Exchange bonus upto ₹6,000 on iPhone"
              offer="Benefit with No Cost EMI schemes"
            /> */}
            <PremiumProductsSection
              products={premiumProducts}
              backgroundColor="#534747"
            />
            <ProductList
              title="Favobliss's Choice"
              data={favoblissChoice || []}
              locationGroups={locationGroups}
              showViewAll={true}
              link="/favobliss-choice?page=1"
            />
            <BrandList brands={Array.isArray(brands) ? brands : [brands]} />
            <HotDealBanner />
            <LatestLaunches />
            <FeatureHighlights />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;
