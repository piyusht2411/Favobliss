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

export const revalidate = 0;

const LandingPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await getProducts();
  const deals = await getHotDeals({
    limit: "10",
    timeFrame: "30 days",
  });

  const favoblissChoice = await getProducts({ isFeatured: true });
  const locations = await getLocations(params.storeId);
  const brands = await getBrands();
  const brandProducts = await getProducts({
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

  const offerImages = [
    {
      imageSrc:
        "https://www.vijaysales.com/event-pages/monsoon-offers/_jcr_content/root/container/container/vscontainer_18487384/vscontainer/teaser.coreimg.jpeg/1750078513023/hair-dryer-desktop-card.jpeg",
      title: "Hair Dryers",
    },
    {
      imageSrc:
        "https://www.vijaysales.com/event-pages/monsoon-offers/_jcr_content/root/container/container/vscontainer_18487384/vscontainer_copy/teaser_copy.coreimg.jpeg/1750078573023/irons-desktop-card.jpeg",
      title: "Hair Dryers",
    },
    {
      imageSrc:
        "https://www.vijaysales.com/event-pages/monsoon-offers/_jcr_content/root/container/container/vscontainer_18487384_443604993/vscontainer/teaser.coreimg.jpeg/1750078626700/air-fryers-desktop-card.jpeg",
      title: "Hair Dryers",
    },
    {
      imageSrc:
        "https://www.vijaysales.com/event-pages/monsoon-offers/_jcr_content/root/container/container/vscontainer_18487384_443604993/vscontainer_copy/teaser_copy.coreimg.jpeg/1750078648770/microwaves-desktop-card.jpeg",
      title: "Hair Dryers",
    },
  ];

  return (
    <>
      <HeroSlider />
      <CategorySlider />
      <GalleryImage />
      <Container>
        <div className="space-y-10 pb-20 mt-20">
          <div className="flex flex-col gap-y-8 md:gap-y-12 px-4 sm:px-6 lg:px-8">
            <HotDealBanner />
            <ProductList
              title="Latest Launches"
              data={products}
              locations={locations}
            />
            <div className="space-y-4 md:space-y-16">
              <Image
                src="/assets/banner.jpg"
                alt="Image"
                width={1500}
                height={300}
                className="object-cover bg-blend-color-burn"
              />
            </div>
            <ProductList
              title="Hot Deals Products"
              data={deals || []}
              locations={locations}
            />

            <BestOfProduct
              products={brandProducts || []}
              title="Best of Apple"
              subtitle="Save up to ₹10,000 instantly on eligible products using ICICI, Axis or Kotak Mahindra Bank Credit Cards | Exchange bonus upto ₹6,000 on iPhone"
              offer="Benefit with No Cost EMI schemes"
            />
            <ProductList
              title="Favobliss's Choice"
              data={favoblissChoice || []}
              locations={locations}
            />
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {offerImages.map((product, index) => (
                  <OfferImage
                    key={index}
                    imageSrc={product.imageSrc}
                    title={product.title}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4 md:space-y-16">
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
            />
            <div className="space-y-4 md:space-y-16">
              <Image
                src="https://www.vijaysales.com/_jcr_content/root/container/container/vscontainer_318402664/vscontainer/productpromtioncardt.coreimg.jpeg/1751543089144/kitchen-appliances-desktop.jpeg"
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
            />

            <div className="space-y-4 md:space-y-16">
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
            />
            <BrandList brands={Array.isArray(brands) ? brands : [brands]} />
            <LatestLaunches />
            {/* <div className="pt-8 ">
              <h3 className="text-3xl font-bold">Hot Deals</h3>
            </div> */}
            {/* <HotDealSlider /> */}
          </div>
        </div>
      </Container>
    </>
  );
};

export default LandingPage;
