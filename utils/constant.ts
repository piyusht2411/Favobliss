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

// export const menuCategories: MenuCategory[] = [
//   {
//     name: "Air Conditioners",
//     items: [
//       { label: "Lloyd Air Conditioners", href: "/lloyd-air-conditioners" },
//       {
//         label: "Blue Star Air Conditioners",
//         href: "/blue-star-air-conditioners",
//       },
//       {
//         label: "Carrier Air Conditioners",
//         href: "/carrier-air-conditioners",
//       },
//       { label: "Daikin Air Conditioners", href: "/daikin-air-conditioners" },
//       { label: "Haier Air Conditioners", href: "/haier-air-conditioners" },
//       {
//         label: "Hitachi Air Conditioners",
//         href: "/hitachi-air-conditioners",
//       },
//       { label: "IFB Air Conditioners", href: "/ifb-air-conditioners" },
//       { label: "LG Air Conditioners", href: "/lg-air-conditioners" },
//       {
//         label: "O General Air Conditioners",
//         href: "/o-general-air-conditioners",
//       },
//       { label: "Onida Air Conditioners", href: "/onida-air-conditioners" },
//       {
//         label: "Panasonic Air Conditioners",
//         href: "/panasonic-air-conditioners",
//       },
//       {
//         label: "Samsung Air Conditioners",
//         href: "/samsung-air-conditioners",
//       },
//       { label: "Voltas Air Conditioners", href: "/voltas-air-conditioners" },
//       {
//         label: "Whirlpool Air Conditioners",
//         href: "/whirlpool-air-conditioners",
//       },
//     ],
//   },
//   {
//     name: "Electronics",
//     items: [
//       { label: "Air Coolers", href: "/air-coolers", count: 36 },
//       { label: "Air Purifier", href: "/air-purifier", count: 113 },
//       { label: "Dishwasher", href: "/dishwasher", count: 26 },
//       { label: "Fan", href: "/fan", count: 239 },
//       { label: "Home Inverter & UPS", href: "/home-inverter-ups", count: 0 },
//       { label: "Iron", href: "/iron", count: 90 },
//       { label: "Phones", href: "/phones", count: 134 },
//       { label: "Refrigerators", href: "/refrigerators", count: 9 },
//       { label: "Room Heaters", href: "/room-heaters", count: 108 },
//       { label: "Sewing Machines", href: "/sewing-machines", count: 21 },
//       { label: "Vacuum Cleaners", href: "/vacuum-cleaners", count: 15 },
//       { label: "Water Heaters", href: "/water-heaters", count: 234 },
//     ],
//     subItems: [
//       {
//         label: "Havells Air Coolers",
//         href: "/havells-air-coolers",
//         count: 4,
//       },
//       {
//         label: "Hindware Air Coolers",
//         href: "/hindware-air-coolers",
//         count: 1,
//       },
//       {
//         label: "Orient Electric Air Coolers",
//         href: "/orient-electric-air-coolers",
//         count: 11,
//       },
//       {
//         label: "Symphony Air Coolers",
//         href: "/symphony-air-coolers",
//         count: 3,
//       },
//       { label: "Usha Air Coolers", href: "/usha-air-coolers", count: 0 },
//       { label: "Voltas Air Coolers", href: "/voltas-air-coolers", count: 0 },
//     ],
//   },
//   {
//     name: "Television",
//     items: [],
//   },
//   {
//     name: "Washing Machine",
//     items: [
//       { label: "Bosch Washing Machines", href: "/bosch-washing-machines" },
//       { label: "Godrey Washing Machine", href: "/godrey-washing-machine" },
//       { label: "Haier Washing Machine", href: "/haier-washing-machine" },
//       { label: "IFB Washing Machine", href: "/ifb-washing-machine" },
//       { label: "LG Washing Machine", href: "/lg-washing-machine" },
//       { label: "Midea Washing Machine", href: "/midea-washing-machine" },
//       { label: "Onida Washing Machines", href: "/onida-washing-machines" },
//       {
//         label: "Panasonic Washing Machines",
//         href: "/panasonic-washing-machines",
//       },
//       { label: "Samsung Washing Machine", href: "/samsung-washing-machine" },
//       { label: "Sansui Washing Machine", href: "/sansui-washing-machine" },
//       { label: "Voltas Washing Machine", href: "/voltas-washing-machine" },
//       {
//         label: "Whirlpool Washing Machine",
//         href: "/whirlpool-washing-machine",
//       },
//     ],
//   },
//   {
//     name: "Home Appliances",
//     items: [
//       { label: "Air Coolers", href: "/air-coolers", count: 36 },
//       { label: "Air Purifier", href: "/air-purifier", count: 113 },
//       { label: "Dishwasher", href: "/dishwasher", count: 26 },
//       { label: "Fan", href: "/fan", count: 239 },
//       { label: "Home Inverter & UPS", href: "/home-inverter-ups", count: 0 },
//       { label: "Iron", href: "/iron", count: 90 },
//       { label: "Phones", href: "/phones", count: 134 },
//       { label: "Refrigerators", href: "/refrigerators", count: 9 },
//       { label: "Room Heaters", href: "/room-heaters", count: 108 },
//       { label: "Sewing Machines", href: "/sewing-machines", count: 21 },
//       { label: "Vacuum Cleaners", href: "/vacuum-cleaners", count: 15 },
//       { label: "Water Heaters", href: "/water-heaters", count: 234 },
//     ],
//     subItems: {
//       "Air Coolers": [
//         {
//           label: "Havells Air Coolers",
//           href: "/havells-air-coolers",
//           count: 4,
//         },
//         {
//           label: "Hindware Air Coolers",
//           href: "/hindware-air-coolers",
//           count: 1,
//         },
//         {
//           label: "Orient Electric Air Coolers",
//           href: "/orient-electric-air-coolers",
//           count: 11,
//         },
//         {
//           label: "Symphony Air Coolers",
//           href: "/symphony-air-coolers",
//           count: 3,
//         },
//         { label: "Usha Air Coolers", href: "/usha-air-coolers", count: 0 },
//         {
//           label: "Voltas Air Coolers",
//           href: "/voltas-air-coolers",
//           count: 0,
//         },
//       ],
//       "Air Purifier": [
//         {
//           label: "Aeroguard Air Purifier",
//           href: "/aeroguard-air-purifier",
//           count: 3,
//         },
//         {
//           label: "Blue Star Air Purifier",
//           href: "/blue-star-air-purifier",
//           count: 2,
//         },
//         {
//           label: "Car Air Purifiers",
//           href: "/car-air-purifiers",
//           count: 2,
//         },
//         {
//           label: "Dyson Air Purifier",
//           href: "/dyson-air-purifier",
//           count: 16,
//         },
//         {
//           label: "Havells Air Purifier",
//           href: "/havells-air-purifier",
//           count: 1,
//         },
//         {
//           label: "Honeywell Air Purifier",
//           href: "/honeywell-air-purifier",
//           count: 6,
//         },
//         {
//           label: "Lg Air Purifier",
//           href: "/lg-air-purifier",
//           count: 2,
//         },
//         {
//           label: "Mi Air Purifiers",
//           href: "/mi-air-purifiers",
//           count: 3,
//         },
//         {
//           label: "Philips Air Purifiers",
//           href: "/philips-air-purifiers",
//           count: 15,
//         },
//         {
//           label: "Samsung Air Purifiers",
//           href: "/samsung-air-purifiers",
//           count: 1,
//         },
//         {
//           label: "Sharp Air Purifiers",
//           href: "/sharp-air-purifiers",
//           count: 15,
//         },
//       ],
//       Dishwasher: [
//         {
//           label: "Bosch Dishwasher",
//           href: "/bosch-dishwasher",
//           count: 1,
//         },
//         {
//           label: "Faber Dishwashers",
//           href: "/faber-dishwashers",
//           count: 6,
//         },
//         {
//           label: "Godrej Dishwasher",
//           href: "/godrej-dishwasher",
//           count: 4,
//         },
//         {
//           label: "Hafele Dishwasher",
//           href: "/hafele-dishwasher",
//           count: 2,
//         },
//         {
//           label: "Samsung Dishwasher",
//           href: "/samsung-dishwasher",
//           count: 1,
//         },
//         {
//           label: "Siemens Dishwashers",
//           href: "/siemens-dishwashers",
//           count: 1,
//         },
//         {
//           label: "Toshiba Dishwasher",
//           href: "/toshiba-dishwasher",
//           count: 2,
//         },
//       ],
//       Fan: [
//         {
//           label: "Almonard Fans",
//           href: "/almonard-fans",
//           count: 0,
//         },
//         {
//           label: "Atomberg ceiling fan",
//           href: "/atomberg-ceiling-fan",
//           count: 16,
//         },
//         {
//           label: "Bajaj Fan",
//           href: "/bajaj-fan",
//           count: 39,
//         },
//         {
//           label: "Crompton Fans",
//           href: "/crompton-fans",
//           count: 28,
//         },
//         {
//           label: "Havells Fans",
//           href: "/havells-fans",
//           count: 68,
//         },
//         {
//           label: "Luminous Fans",
//           href: "/luminous-fans",
//           count: 0,
//         },
//         {
//           label: "Orient Electric Fans",
//           href: "/orient-electric-fans",
//           count: 5,
//         },
//         {
//           label: "Polycab Fan",
//           href: "/polycab-fan",
//           count: 19,
//         },
//         {
//           label: "Standard Fan",
//           href: "/standard-fan",
//           count: 13,
//         },
//         {
//           label: "Usha Fans",
//           href: "/usha-fans",
//           count: 28,
//         },
//       ],
//       Iron: [
//         {
//           label: "Bajaj Iron",
//           href: "/bajaj-iron",
//           count: 8,
//         },
//         {
//           label: "Black & Decker",
//           href: "/black-decker",
//           count: 7,
//         },
//         {
//           label: "Crompton Irons",
//           href: "/crompton-irons",
//           count: 1,
//         },
//         {
//           label: "Havells Irons",
//           href: "/havells-irons",
//           count: 18,
//         },
//         {
//           label: "Inalsa iron",
//           href: "/inalsa-iron",
//           count: 7,
//         },
//         {
//           label: "Morphy Richards",
//           href: "/morphy-richards",
//           count: 5,
//         },
//         {
//           label: "Philips Iron",
//           href: "/philips-iron",
//           count: 22,
//         },
//         {
//           label: "Russell hobbs",
//           href: "/russell-hobbs",
//           count: 2,
//         },
//         {
//           label: "Tefal Iron",
//           href: "/tefal-iron",
//           count: 4,
//         },
//         {
//           label: "Usha iron",
//           href: "/usha-iron",
//           count: 14,
//         },
//       ],
//       Phones: [
//         {
//           label: "Apple Mobile Phones",
//           href: "/apple-mobile-phones",
//           count: 55,
//         },
//         {
//           label: "Mi Mobile Phone",
//           href: "/mi-mobile-phone",
//           count: 9,
//         },
//         {
//           label: "Oneplus Mobile Phones",
//           href: "/oneplus-mobile-phones",
//           count: 41,
//         },
//         {
//           label: "Oppo mobile phones",
//           href: "/oppo-mobile-phones",
//           count: 15,
//         },
//         {
//           label: "Realme Mobile Phones",
//           href: "/realme-mobile-phones",
//           count: 5,
//         },
//         {
//           label: "Samsung Mobile Phones",
//           href: "/samsung-mobile-phones",
//           count: 67,
//         },
//         {
//           label: "Vivo Mobile Phones",
//           href: "/vivo-mobile-phones",
//           count: 25,
//         },
//       ],
//       Refrigerators: [
//         {
//           label: "Bosch Refrigerators",
//           href: "/bosch-refrigerators",
//           count: 0,
//         },
//         {
//           label: "Godrej Refrigerators",
//           href: "/godrej-refrigerators",
//           count: 0,
//         },
//         {
//           label: "Haier Refrigerators",
//           href: "/haier-refrigerators",
//           count: 1,
//         },
//         {
//           label: "Hisense Refrigerators",
//           href: "/hisense-refrigerators",
//           count: 1,
//         },
//         {
//           label: "Hitachi Refrigerators",
//           href: "/hitachi-refrigerators",
//           count: 0,
//         },
//         {
//           label: "Ig refrigerators",
//           href: "/ig-refrigerators",
//           count: 10,
//         },
//         {
//           label: "Panasonic Refrigerators",
//           href: "/panasonic-refrigerators",
//           count: 0,
//         },
//         {
//           label: "Samsung Refrigerators",
//           href: "/samsung-refrigerators",
//           count: 0,
//         },
//         {
//           label: "Visi Cooler",
//           href: "/visi-cooler",
//           count: 0,
//         },
//         {
//           label: "Voltas beko",
//           href: "/voltas-beko",
//           count: 1,
//         },
//         {
//           label: "Whirlpool Refrigerators",
//           href: "/whirlpool-refrigerators",
//           count: 1,
//         },
//       ],
//       "Room Heaters": [
//         {
//           label: "Bajaj Room Heaters",
//           href: "/bajaj-room-heaters",
//           count: 16,
//         },
//         {
//           label: "Crompton Room Heater",
//           href: "/crompton-room-heater",
//           count: 9,
//         },
//         {
//           label: "Havells Room Heater",
//           href: "/havells-room-heater",
//           count: 29,
//         },
//         {
//           label: "Maharaja Room Heaters",
//           href: "/maharaja-room-heaters",
//           count: 1,
//         },
//         {
//           label: "Morphy Richards Heater",
//           href: "/morphy-richards-heater",
//           count: 7,
//         },
//         {
//           label: "Orient Room Heater",
//           href: "/orient-room-heater",
//           count: 4,
//         },
//         {
//           label: "Orpat Room Heaters",
//           href: "/orpat-room-heaters",
//           count: 3,
//         },
//         {
//           label: "Usha Room Heaters",
//           href: "/usha-room-heaters",
//           count: 10,
//         },
//       ],
//       "Sewing Machines": [
//         {
//           label: "Bernette Sewing Machine",
//           href: "/bernette-sewing-machine",
//           count: 4,
//         },
//         {
//           label: "Usha Sewing Machine",
//           href: "/usha-sewing-machine",
//           count: 11,
//         },
//       ],
//       "Vacuum Cleaners": [
//         {
//           label: "Dyson Vacuum Cleaners",
//           href: "/dyson-vacuum-cleaners",
//           count: 5,
//         },
//         {
//           label: "Eureka Forbes Vacuum Cleaners",
//           href: "/eureka-forbes-vacuum-cleaners",
//           count: 3,
//         },
//         {
//           label: "Philips Vacuum Cleaners",
//           href: "/philips-vacuum-cleaners",
//           count: 3,
//         },
//       ],
//       "Water Heaters": [
//         {
//           label: "Racold Water Geysers",
//           href: "/racold-water-geysers",
//           count: 29,
//         },
//         {
//           label: "AO Smith Water Geysers",
//           href: "/ao-smith-water-geysers",
//           count: 25,
//         },
//         {
//           label: "Bajaj Water Geysers",
//           href: "/bajaj-water-geysers",
//           count: 29,
//         },
//         {
//           label: "Crompton Water Geysers",
//           href: "/crompton-water-geysers",
//           count: 10,
//         },
//         {
//           label: "Faber Water Geysers",
//           href: "/faber-water-geysers",
//           count: 1,
//         },
//         {
//           label: "Havells Water Geysers",
//           href: "/havells-water-geysers",
//           count: 46,
//         },
//         {
//           label: "Hindware Water Geyser",
//           href: "/hindware-water-geysers",
//           count: 14,
//         },
//         {
//           label: "Maharaja Water Geyser",
//           href: "/maharaja-water-geysers",
//           count: 1,
//         },
//         {
//           label: "Morphy Richards Water Geysers",
//           href: "/morphy-richards-water-geysers",
//           count: 3,
//         },
//         {
//           label: "Orient Electric Water Heater",
//           href: "/orient-electric-water-heater",
//           count: 3,
//         },
//         {
//           label: "Orient Water Heaters",
//           href: "/orient-water-heaters",
//           count: 0,
//         },
//         {
//           label: "Usha Water Heaters",
//           href: "/usha-water-heaters",
//           count: 35,
//         },
//         {
//           label: "V Guard Water Heaters",
//           href: "/v-guard-water-heaters",
//           count: 2,
//         },
//         {
//           label: "Venus Water Heater",
//           href: "/venus-water-heaters",
//           count: 9,
//         },
//       ],
//     },
//   },
//   {
//     name: "Kitchen Appliances",
//     items: [
//       { label: "Air Fryers", href: "/air-fryers" },
//       { label: "Coffee Maker", href: "/coffee-maker" },
//       { label: "Electric Kettles", href: "/electric-kettles" },
//       { label: "Rice Cooker", href: "/rice-cooker" },
//       { label: "Food Processors", href: "/food-processors" },
//       { label: "Hand Blender Mixer", href: "/hand-blender-mixer" },
//       { label: "Hand Mixers", href: "/hand-mixers" },
//       { label: "Induction Cooktops", href: "/induction-cooktops" },
//     ],
//     subItems: [
//       { label: "Kitchen Chimney", href: "/kitchen-chimney" },
//       { label: "Microwave Ovens", href: "/microwave-ovens" },
//       { label: "Mixer Juicer Grinder", href: "/mixer-juicer-grinder" },
//       { label: "Oven Toaster Grillers", href: "/oven-toaster-grillers" },
//       { label: "Pop Up Toasters", href: "/pop-up-toasters" },
//       { label: "Sandwich Makers", href: "/sandwich-makers" },
//       {
//         label: "Small Kitchen Appliances",
//         href: "/small-kitchen-appliances",
//       },
//       { label: "Water Purifiers", href: "/water-purifiers" },
//     ],
//   },
//   {
//     name: "Computer & Printer",
//     items: [
//       { label: "Laptops", href: "/laptops" },
//       { label: "Printer", href: "/printer" },
//       { label: "Label Printers", href: "/label-printers" },
//       { label: "Ethernet Routers", href: "/ethernet-routers" },
//       { label: "Keyboards", href: "/keyboards" },
//       { label: "Mouse", href: "/mouse" },
//     ],
//     subItems: [
//       { label: "Hard Disk", href: "/hard-disk" },
//       { label: "Laptop Bags", href: "/laptop-bags" },
//       { label: "Pen Drives", href: "/pen-drives" },
//       { label: "UPS", href: "/ups" },
//     ],
//   },
//   {
//     name: "Personal Care",
//     items: [
//       { label: "Epilators", href: "/epilators" },
//       { label: "Hair Curlers", href: "/hair-curlers" },
//       { label: "Hair Dryers", href: "/hair-dryers" },
//       { label: "Hair Straighteners", href: "/hair-straighteners" },
//       { label: "Health Care", href: "/health-care" },
//       { label: "Trimmers", href: "/trimmers" },
//     ],
//   },
// ];

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
