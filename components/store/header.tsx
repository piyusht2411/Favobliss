"use client";
import React, { useState } from "react";
import { Search, MapPin, ShoppingCart, ChevronDown } from "lucide-react";
import { MdArrowRight, MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import Link from "next/link";
import useMediaQuery from "@/hooks/use-mediaquery";
import { Popover, Transition } from "@headlessui/react";
import { MenuCategory, MenuItem } from "@/types";
import { useRouter } from "next/navigation";
import { Account } from "@/components/account";
import { useCart } from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";

const searchCategories = [
  "All",
  "Air Conditioners",
  "Boat Speakers",
  "Bosch Washing Machines",
  "Carrier Air Conditioners",
  "Daikin Air Conditioners",
  "Electronics",
  "Food Processors",
  "Hair Dryers",
  "Home Appliances",
  "Kitchen Appliances",
  "Personal Care",
  "Television",
  "Washing Machine",
];

interface DynamicHeaderProps {
  categories: any[];
}

export default function DynamicHeader({ categories }: DynamicHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const router = useRouter();
  const { getItemCount, getTotalAmount } = useCart();

  const itemCount = getItemCount() || 0;
  const totalAmount = getTotalAmount() || 0;

  const transformCategoriesToMenuCategories = (
    apiCategories: any[]
  ): MenuCategory[] => {
    return apiCategories?.map((category) => {
      const menuCategory: MenuCategory = {
        name: category.name,
        items: [],
        subItems: undefined,
        link: `/category/${category.id}?page=1`,
        slug: `/category/${category.slug}?page=1`,
      };

      if (category.subCategories && category.subCategories.length > 0) {
        if (category.name === "HOME APPLIANCES") {
          menuCategory.items = category.subCategories.map((subCat: any) => ({
            label: subCat.name,
            href: `/category/${category.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${subCat.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            count: subCat.childSubCategories?.length || 0,
          }));

          const subItemsObj: { [key: string]: MenuItem[] } = {};
          category.subCategories.forEach((subCat: any) => {
            if (
              subCat.childSubCategories &&
              subCat.childSubCategories.length > 0
            ) {
              subItemsObj[subCat.name] = subCat.childSubCategories.map(
                (childSubCat: any) => ({
                  label: childSubCat.name,
                  href: `/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${subCat.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${childSubCat.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
                  count: 0,
                })
              );
            }
          });
          menuCategory.subItems = subItemsObj;
        } else {
          menuCategory.items = category.subCategories.map((subCat: any) => ({
            label: subCat.name,
            href: `/category/${category.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${subCat.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            count: subCat.childSubCategories?.length || 0,
          }));

          if (
            category.subCategories.some(
              (subCat: any) => subCat.childSubCategories?.length > 0
            )
          ) {
            const allChildSubCategories: MenuItem[] = [];
            category.subCategories.forEach((subCat: any) => {
              if (
                subCat.childSubCategories &&
                subCat.childSubCategories.length > 0
              ) {
                subCat.childSubCategories.forEach((childSubCat: any) => {
                  allChildSubCategories.push({
                    label: childSubCat.name,
                    href: `/category/${category.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}/${subCat.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}/${childSubCat.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`,
                    count: 0,
                  });
                });
              }
            });
            if (allChildSubCategories.length > 0) {
              menuCategory.subItems = allChildSubCategories;
            }
          }
        }
      } else {
        menuCategory.items = [
          {
            label: category.name,
            href: `/category/${category.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            count: 0,
          },
        ];
      }

      return menuCategory;
    });
  };

  const menuCategories = transformCategoriesToMenuCategories(categories);

  if (isMobile) {
    return null;
  }

  const getRightAlignedCategories = (categories: MenuCategory[]) => {
    if (categories.length >= 2) {
      return categories.slice(-2).map((cat) => cat.name);
    }
    return [];
  };

  const rightAlignedCategories = getRightAlignedCategories(menuCategories);

  function doubleMenuCategory(category: string): boolean {
    const categories = [
      "Electronics",
      "Kitchen Appliances",
      "Computer & Printer",
    ];
    return categories.includes(category);
  }

  const renderHomeAppliancesMenu = (category: MenuCategory, close: any) => {
    return (
      <div className="py-2">
        {category.items.map((item) => (
          <div key={item.label} className="relative group w-max">
            <>
              <div className="flex items-center justify-between hover:bg-gray-50 px-4 py-2 cursor-pointer w-52">
                <div className="flex gap-2 items-center">
                  <Link
                    href={item.href}
                    className="text-xs text-black flex-1"
                    onClick={() => close()}
                  >
                    {item.label}
                  </Link>
                  <span className="bg-gray-500 text-white text-xs rounded-full text-center p-[2px] min-w-5 min-h-5 text-[10px] border border-transparent">
                    {item.count}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-lg">
                    {<MdArrowRight />}
                  </span>
                </div>
              </div>

              <div className="absolute left-full top-0 ml-1 w-max bg-white border border-gray-200 rounded-md shadow-lg z-30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {category.subItems &&
                    typeof category.subItems === "object" &&
                    !Array.isArray(category.subItems) &&
                    category.subItems[item.label] &&
                    category.subItems[item.label].map((subItem: any) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2 text-xs text-black hover:text-blue-800"
                        onClick={() => close()}
                      >
                        <span>{subItem.label}</span>
                        <span className="bg-gray-500 text-white text-xs rounded-full text-center p-[2px] min-w-5 min-h-5 text-[10px] border border-transparent">
                          {subItem.count}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            </>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-black">
      <div className="max-w-[1400px] m-auto pb-5">
        <header className="bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <img
                src="https://www.favobliss.com/image/cache/catalog/logo/favobliss-full-logo-2503x938.jpg"
                width="200"
                height="60"
                alt="Favobliss"
                title="Favobliss"
                className="max-w-full"
              />
            </Link>
          </div>

          <div className="flex-1 mx-6 max-w-2xl relative">
            <div className="relative flex bg-white rounded-md overflow-hidden">
              <div className="relative">
                <button
                  onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                  className="flex items-center gap-1 bg-[rgb(238,140,29)] text-white px-4 py-2.5 text-sm font-medium hover:bg-[rgb(238,140,29)] transition-colors min-w-max"
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      isSearchDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for Product Brand..."
                  className="w-full py-2.5 px-4 text-black focus:outline-none text-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded transition-colors">
                  <Search size={24} className="text-black" />
                </button>
              </div>
            </div>

            {isSearchDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] max-h-60 overflow-y-auto mt-1">
                <div className="py-1">
                  {searchCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <Account
            // session={status === "authenticated"}
            // name={session?.user?.name || "Guest"}
            />

            <div className="hidden md:flex items-center space-x-1 text-sm">
              <MapPin size={24} />
              <span>Mumbai, 400049</span>
            </div>

            <Link
              href="/checkout/cart"
              className="flex items-center gap-2 text-sm border border-customGray rounded-md pr-[12px]"
            >
              <div className="flex flex-col">
                <span className="text-sm p-[10px]">
                  {itemCount} item(s) - {formatter.format(totalAmount)}
                </span>
              </div>
              <ShoppingCart size={24} />
            </Link>
          </div>
        </header>
        {isSearchDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsSearchDropdownOpen(false)}
          />
        )}
        <nav className="bg-black text-white py-2 px-6 flex justify-between items-center shadow-md flex-wrap gap-2 gap-y-5 max-w-7xl mx-auto">
          {menuCategories.map((category) => (
            <Popover key={category.name} className="relative">
              {({ open, close }) => (
                <>
                  <div
                    onMouseEnter={() => {
                      const button = document.getElementById(
                        `popover-button-${category.name}`
                      );
                      if (button) button.click();
                    }}
                    onMouseLeave={() => close()}
                  >
                    <button
                      onClick={() => router.push(category.slug)}
                      className="w-full h-full px-3 text-sm hover:text-gray-300 focus:outline-none text-left"
                    >
                      {category.name.toUpperCase()}
                    </button>

                    <Popover.Button
                      id={`popover-button-${category.name}`}
                      className="sr-only"
                    >
                      {category.name.toUpperCase()}
                    </Popover.Button>
                  </div>

                  <Transition
                    show={open}
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Popover.Panel
                      static
                      className={`absolute mt-2 bg-white text-black rounded-md shadow-lg z-10 ${
                        rightAlignedCategories.includes(category.name)
                          ? "right-0"
                          : "left-0"
                      } ${
                        category.name === "HOME APPLIANCES" ? "w-max" : "w-96"
                      }`}
                      onMouseEnter={() => {
                        const button = document.getElementById(
                          `popover-button-${category.name}`
                        );
                        if (button) button.click();
                      }}
                      onMouseLeave={() => close()}
                    >
                      {category.name === "HOME APPLIANCES"
                        ? renderHomeAppliancesMenu(category, close)
                        : (category.items.length > 0 ||
                            (Array.isArray(category.subItems) &&
                              category.subItems.length > 0)) && (
                            <div
                              className={`p-4 ${
                                doubleMenuCategory(category.name)
                                  ? "grid grid-cols-2 gap-4"
                                  : "unset"
                              }`}
                            >
                              <div>
                                <h3 className="text-orange-600 font-semibold mb-2">
                                  {category.name === "ELECTRONICS" ||
                                  category.name === "Kitchen Appliances" ||
                                  category.name === "Computer & Printer"
                                    ? "Top Categories"
                                    : category.name}
                                </h3>
                                <div
                                  className={`w-full ${
                                    doubleMenuCategory(category.name)
                                      ? "unset"
                                      : "grid grid-cols-2 gap-x-2"
                                  }`}
                                >
                                  {category.items.map((item) => (
                                    <div key={item.label} className="relative">
                                      <Link
                                        href={item.href}
                                        className="block text-sm text-blue-600 hover:underline hover:text-blue-800 py-1"
                                        onClick={() => close()}
                                      >
                                        {item.label}{" "}
                                        {item.count !== undefined &&
                                          `(${item.count})`}
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {category.subItems &&
                                Array.isArray(category.subItems) &&
                                category.subItems.length > 0 && (
                                  <div>
                                    <h3 className="text-orange-600 font-semibold mb-2">
                                      {category.name === "ELECTRONICS"
                                        ? "Air Coolers"
                                        : category.name === "Computer & Printer"
                                        ? "Computer Accessories"
                                        : "Top Categories"}
                                    </h3>
                                    {category.subItems.map((subItem) => (
                                      <Link
                                        key={subItem.label}
                                        href={subItem.href}
                                        className="block text-sm text-blue-600 hover:underline hover:text-blue-800 py-1"
                                        onClick={() => close()}
                                      >
                                        {subItem.label}{" "}
                                        {subItem.count !== undefined &&
                                          `(${subItem.count})`}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          )}
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          ))}
        </nav>
      </div>
    </div>
  );
}
