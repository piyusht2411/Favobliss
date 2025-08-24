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

export const revalidate = 0;

const LandingPage = async ({ params }: { params: { storeId: string } }) => {
  const { products } = await getProducts();
  const { products: homeApplicance } = await getProducts({
    categoryId: "6843219ac338ba8cc9db1e72",
  });
  const brandCategory = await getSubCategories("68431da0c338ba8cc9db1e6d");
  const deals = await getHotDeals({
    limit: "10",
    timeFrame: "30 days",
  });

  const { products: favoblissChoice } = await getProducts({ isFeatured: true });
  const categories = await getCategories();
  const locations = await getLocations(params.storeId);
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
            <RecentlyViewed locations={locations} />
            <ProductList
              title="Latest Launches"
              data={products}
              locations={locations}
              showViewAll={true}
            />
            <PromotionalBanner
              data={favoblissChoice}
              locations={locations}
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
            <LandingPageSection
              title="Home Appliances"
              items={applianceItems}
              viewAllLink="/category/home-appliances?page=1"
              className="mx-auto bg-[#d8d8d8]"
            />
            <ProductList
              title=""
              data={homeApplicance || []}
              locations={locations}
            />
            <LandingPageSection
              title="Kitchen Appliances"
              items={kitchenAppliance}
              viewAllLink="/category/kitchen-appliances?page=1"
              className="mx-auto bg-[#b8e0ee]"
            />
            <ProductList title="" data={kitchen || []} locations={locations} />
            {/* <BestOfProduct
              products={brandProducts || []}
              title="Best of Apple"
              subtitle="Save up to ₹10,000 instantly on eligible products using ICICI, Axis or Kotak Mahindra Bank Credit Cards | Exchange bonus upto ₹6,000 on iPhone"
              offer="Benefit with No Cost EMI schemes"
            /> */}
            <PremiumProductsSection
              products={premiumProducts}
              backgroundColor="#534747"
              // className="mx-auto"
            />
            <ProductList
              title="Favobliss's Choice"
              data={favoblissChoice || []}
              locations={locations}
            />
            {/* <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {offerImages.map((product, index) => (
                  <OfferImage
                    key={index}
                    imageSrc={product.imageSrc}
                    title={product.title}
                  />
                ))}
              </div>
            </div> */}

            {/* <div className="space-y-4 md:space-y-16">
              <Image
                src="https://www.vijaysales.com/_jcr_content/root/container/container/vscontainer_92192583/vscontainer/productpromtioncardt.coreimg.jpeg/1750505071227/back-to-school-clp-desktop.jpeg"
                alt="Image"
                width={1500}
                height={300}
                className="object-cover bg-blend-color-burn"
              />
            </div>
            <ProductList
              title=""
              data={laptops || []}
              locations={locations}
              isSpaceTop={true}
            /> */}
            {/* <div className="space-y-4 md:space-y-16">
              <Image
                src="https://www.vijaysales.com/_jcr_content/root/container/container/vscontainer_318402664/vscontainer/productpromtioncardt.coreimg.jpeg/1753689025425/kitchen-appliances-desktop.jpeg"
                alt="Image"
                width={1500}
                height={300}
                className="object-cover bg-blend-color-burn"
              />
            </div>
            <ProductList
              title=""
              data={kitchen || []}
              locations={locations}
              isSpaceTop={true}
            /> */}

            {/* <div className="space-y-4 md:space-y-16">
              <Image
                src="/assets/washing.jpg"
                alt="Image"
                width={1500}
                height={300}
                className="object-cover bg-blend-color-burn"
              />
            </div>
            <ProductList
              title=""
              data={washingMachines || []}
              locations={locations}
              isSpaceTop={true}
            /> */}
            <BrandList brands={Array.isArray(brands) ? brands : [brands]} />
            <HotDealBanner />
            <LatestLaunches />
            <FeatureHighlights />
            {/* <div className="pt-8 ">
              <h3 className="text-3xl font-bold">Hot Deals</h3>
            </div> */}
            {/* <HotDealSlider /> */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;
