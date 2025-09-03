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
    title: "Soundbars",
    image:
      "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754591877/lsvwpa783e1i79vmkg8c.png",
    link: "/category/electronics?sub=soundbars?page=1",
  },
  {
    id: "2",
    title: "Smart Watches",
    image:
      "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754591933/ehtqn18xo292atf80zze.png",
    link: "/category/electronics?sub=smartwatches?page=1",
  },
  {
    id: "3",
    title: "Speakers",
    image:
      "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754591974/ta6bjci2imkmv0dqxzwc.png",
    link: "/category/electronics?sub=speakers?page=1",
  },
  {
    id: "4",
    title: "TVs",
    image:
      "http://res.cloudinary.com/dgcksrb1n/image/upload/v1754592010/cp5ilmyukabjlstax3hr.png",
    link: "/category/computer-and-printer?sub=gaming-laptops?page=1",
    badge: "NEW",
  },
];

export const kitchenAppliance: any[] = [
  {
    id: "6846b1218f5c2887dac45aa2",
    title: "Coffee Maker",
    image:
      "https://img.freepik.com/free-photo/view-coffee-making-machine_23-2150698665.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=coffee-maker?page=1",
    backgroundColor: "#f8f9fa",
  },
  {
    id: "6846b1638f5c2887dac45aa4",
    title: "Rice Cooker",
    image:
      "https://img.freepik.com/premium-photo/electric-rice-cooker-white-background_933530-7898.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=rice-cooker?page=1",
    backgroundColor: "#fff5f5",
  },
  {
    id: "6846b1bc8f5c2887dac45aa7",
    title: "Hand Mixers",
    image:
      "https://img.freepik.com/premium-photo/confectioner-makes-blender-cream-cake-kitchen_210733-2368.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=hand-mixers?page=1",
    backgroundColor: "#f0fdf4",
  },
  {
    id: "6846b25e8f5c2887dac45aad",
    title: "Toaster",
    image:
      "https://img.freepik.com/free-photo/brown-retro-electronic-toaster-device_23-2151002823.jpg?ga=GA1.1.848270097.1752087718&semt=ais_hybrid&w=740&q=80",
    link: "/category/kitchen-appliances?sub=pop-up-toasters?page=1",
    backgroundColor: "#fefce8",
  },
];

export const applianceItems: any[] = [
  {
    id: "68469b178f5c2887dac45a3f",
    title: "Air purifier",
    image:
      "https://img.freepik.com/premium-vector/air-purifier-realistic-poster-with-editable-text-modern-appliance-living-room-fresh-air-dust-removing-vector-illustration_1284-70567.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=air-purifier?page=1",
    backgroundColor: "#f8f9fa",
  },
  {
    id: "68469b898f5c2887dac45a40",
    title: "Dishwasher",
    image:
      "https://img.freepik.com/free-vector/3d-realistic-mock-up-kitchen-room-with-white-clean-floor-tile-wall_1441-2103.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=dishwasher?page=1",
    backgroundColor: "#fff5f5",
  },
  {
    id: "68469c888f5c2887dac45a45",
    title: "Refrigerators",
    image:
      "https://img.freepik.com/free-vector/household-appliances-gift-realistic_1284-65309.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=refrigerators?page=1",
    backgroundColor: "#f0fdf4",
  },
  {
    id: "68469bd98f5c2887dac45a41",
    title: "Fan",
    image:
      "https://img.freepik.com/premium-vector/ceiling-fan-silhouette-vector-white-background_931294-1887.jpg?ga=GA1.1.1292182921.1754325589&semt=ais_hybrid&w=740&q=80",
    link: "/category/home-appliances?sub=fan?page=1",
    backgroundColor: "#fefce8",
  },
];

export const brandItems: any[] = [
  {
    id: "68b820c05b97348b5d2f2c2c",
    title: "Smart Watches",
    image:
      "https://img.freepik.com/premium-photo/watch-with-black-band-that-says-watch-face_1171594-38413.jpg?ga=GA1.1.357575914.1756896553&semt=ais_incoming&w=740&q=80",
    link: "/category/home-appliances?sub=air-purifier?page=1",
    backgroundColor: "#f8f9fa",
  },
  {
    id: "68b81e52465a0b8c791ba767",
    title: "Soundbar",
    image:
      "https://img.freepik.com/free-photo/rendering-smart-home-device_23-2151039348.jpg?ga=GA1.1.357575914.1756896553&semt=ais_incoming&w=740&q=80",
    link: "/category/home-appliances?sub=dishwasher?page=1",
    backgroundColor: "#fff5f5",
  },
  {
    id: "68b81f5a465a0b8c791ba76a",
    title: "Headphones",
    image:
      "https://img.freepik.com/free-photo/headphones-displayed-against-dark-background_157027-4466.jpg?ga=GA1.1.357575914.1756896553&semt=ais_incoming&w=740&q=80",
    link: "/category/home-appliances?sub=refrigerators?page=1",
    backgroundColor: "#f0fdf4",
  },
  {
    id: "68b8200c465a0b8c791ba76b",
    title: "Earbuds",
    image:
      "https://img.freepik.com/premium-photo/air-buds-bluetooth_761902-2567.jpg?ga=GA1.1.357575914.1756896553&semt=ais_incoming&w=740&q=80",
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
