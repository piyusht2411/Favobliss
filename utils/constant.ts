import { MenuCategory } from "@/types";
import {
  MdShoppingBag,
  MdFavorite,
  MdLogin,
  MdPersonAdd,
  MdStore,
  MdSupportAgent,
} from "react-icons/md";

import { ApiCategory } from "@/types";

export const userMenuItems = [
  { label: "My Orders", href: "/orders", icon: MdShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: MdFavorite },
  { label: "Sign In", href: "/login", icon: MdLogin },
  {
    label: "Sign Up",
    href: "/registration",
    icon: MdPersonAdd,
  },
  // {
  //   label: "Become a Seller",
  //   href: "/",
  //   icon: MdStore,
  // },
  // {
  //   label: "Customer Care",
  //   href: "/",
  //   icon: MdSupportAgent,
  // },
];

export const offerImages = [
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

export const premiumProducts: any[] = [
  {
    id: "1",
    title: "Mobiles",
    image:
      "https://img.freepik.com/premium-psd/realistic-premium-smartphone-app-presentation-screen-mockup-template-with-transparent-background_349001-473.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/electronics?sub=mobile?page=1",
  },
  {
    id: "2",
    title: "Printers",
    image:
      "https://img.freepik.com/premium-vector/realistic-inkjet-printer-isoalted-white-background_208593-71.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/printers?sub=mobile?page=1",
  },
  {
    id: "3",
    title: "Laptops",
    image:
      "https://img.freepik.com/free-photo/still-life-books-versus-technology_23-2150062920.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/laptops?sub=mobile?page=1",
  },
  {
    id: "4",
    title: "TVs",
    image:
      "https://img.freepik.com/premium-photo/tv-cabinet-modern-living-room-white-wall_41470-1767.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/television?page=1",
    badge: "NEW",
  },
];

export const kitchenAppliance: any[] = [
  {
    id: "1",
    title: "Coffee Maker",
    image:
      "https://img.freepik.com/free-photo/view-coffee-making-machine_23-2150698665.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=coffee-maker?page=1",
    backgroundColor: "#f8f9fa",
  },
  {
    id: "2",
    title: "Rice Cooker",
    image:
      "https://img.freepik.com/premium-photo/electric-rice-cooker-white-background_933530-7898.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=rice-cooker?page=1",
    backgroundColor: "#fff5f5",
  },
  {
    id: "3",
    title: "Hand Mixers",
    image:
      "https://img.freepik.com/premium-photo/confectioner-makes-blender-cream-cake-kitchen_210733-2368.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=hand-mixers?page=1",
    backgroundColor: "#f0fdf4",
  },
  {
    id: "4",
    title: "Toaster",
    image:
      "https://img.freepik.com/free-photo/brown-retro-electronic-toaster-device_23-2151002823.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=pop-up-toasters?page=1",
    backgroundColor: "#fefce8",
  },
];

export const applianceItems: any[] = [
  {
    id: "1",
    title: "Air purifier",
    image:
      "https://img.freepik.com/premium-vector/air-purifier-realistic-poster-with-editable-text-modern-appliance-living-room-fresh-air-dust-removing-vector-illustration_1284-70567.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=air-coolers?page=1",
    backgroundColor: "#f8f9fa",
  },
  {
    id: "2",
    title: "Dishwasher",
    image:
      "https://img.freepik.com/free-vector/3d-realistic-mock-up-kitchen-room-with-white-clean-floor-tile-wall_1441-2103.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=dishwasher?page=1",
    backgroundColor: "#fff5f5",
  },
  {
    id: "3",
    title: "Refrigerators",
    image:
      "https://img.freepik.com/free-vector/household-appliances-gift-realistic_1284-65309.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=refrigerators?page=1",
    backgroundColor: "#f0fdf4",
  },
  {
    id: "4",
    title: "Fan",
    image:
      "https://img.freepik.com/premium-vector/ceiling-fan-silhouette-vector-white-background_931294-1887.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=fan?page=1",
    backgroundColor: "#fefce8",
  },
];

export const getSearchCategories = (categories: ApiCategory[]): string[] => {
  const categoryNames = categories.map((cat) => cat.name);
  const subcategoryNames = categories.flatMap((cat) =>
    cat.subCategories.map((sub) => sub.name)
  );
  return [
    "All",
    ...Array.from(new Set([...categoryNames, ...subcategoryNames])),
  ].sort();
};
