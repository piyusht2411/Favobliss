"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  Plus,
  Minus,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import useMediaQuery from "@/hooks/use-mediaquery";
import { MenuCategory, MenuItem } from "@/types";
import { useSession } from "next-auth/react";
import { Account } from "@/components/account";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

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

interface HeaderMobileProps {
  categories: any[];
}

export default function HeaderMobile({ categories }: HeaderMobileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const { data: session, status } = useSession();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    categories: any[];
    products: any[];
    subCategories?: any[];
    brands?: any[];
    isSuggested?: boolean;
    pagination: {
      page: number;
      limit: number;
      totalCategories: number;
      totalProducts: number;
    };
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    // Fetch suggested results when component mounts and searchQuery is empty
    if (!searchQuery) {
      debouncedSearch("");
    }
  }, []); // Empty dependency array to run on mount

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        !isSearchDropdownOpen
      ) {
        setSearchQuery("");
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchDropdownOpen]);

  // Debounced search function
  const debouncedSearch = useDebounce(async (query: string) => {
    if (isMounted.current) {
      setIsSearching(true);
    }

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/search-item?query=${encodeURIComponent(query)}&page=1&limit=10`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchResults(data);
      if (isMounted.current) {
        setSearchResults(data);
      }
    } catch (error) {
      console.error("[SEARCH_FETCH]", error);
      if (isMounted.current) {
        setSearchResults(null);
      }
    } finally {
      if (isMounted.current) {
        setIsSearching(false);
      }
    }
  }, 800);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle search result click
  const handleResultClick = (href: string) => {
    setShowSearchResults(false);
    router.push(href);
  };

  if (!isMobile) {
    return null;
  }

  const transformCategoriesToMenuCategories = (
    apiCategories: any[]
  ): MenuCategory[] => {
    return apiCategories.map((category) => {
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
            href: `/category/${category.slug}?sub=${subCat.slug}?page=1`,
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
                  href: `/category/${category.slug}?sub=${subCat.slug}&childsub=${childSubCat.slug}?page=1`,
                  count: 0,
                })
              );
            }
          });
          menuCategory.subItems = subItemsObj;
        } else {
          menuCategory.items = category.subCategories.map((subCat: any) => ({
            label: subCat.name,
            href: `/category/${category.slug}?sub=${subCat.slug}?page=1`,
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
                    href: `/category/${category.slug}?sub=${subCat.slug}&childsub=${childSubCat.slug}?page=1`,
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
            href: `/category/${category.slug}`,
            count: 0,
          },
        ];
      }

      return menuCategory;
    });
  };

  const menuCategories = transformCategoriesToMenuCategories(categories);

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <header className="bg-black text-white py-4 px-4 shadow-md border border-transparent rounded-2xl">
      {/* Top Row: Menu Icon, Logo, Profile, Cart */}
      <div className="flex items-center justify-between">
        {/* Left: Menu Icon and Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
          >
            <Menu size={24} className="text-white" />
          </button>
          <Link href="/">
            <img
              width="120px"
              className="rounded-md"
              src="/assets/favo-logo.jpg"
              alt="Favo Logo"
            />
          </Link>
        </div>

        {/* Right: Profile, Cart */}
        <div className="flex items-start space-x-4">
          <Account />
          <button className="relative">
            <Link href="/checkout/cart">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </button>
        </div>
      </div>

      {/* Search Bar with Category Grid Dropdown */}
      <div className="mt-2 relative" ref={searchDropdownRef}>
        <div className="relative flex bg-white overflow-hidden rounded-[6px]">
          {/* Category Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              className="flex items-center gap-1 bg-[rgb(238,140,29)] text-white px-3 py-2 text-xs font-medium hover:bg-[rgb(238,140,29)] transition-colors min-w-max rounded-l-[6px] h-full"
            >
              <span className="truncate max-w-[80px]">{selectedCategory}</span>
              <ChevronDown
                size={14}
                className={`transform transition-transform flex-shrink-0 ${
                  isSearchDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for Product Brands..."
              className="w-full py-2 px-4 text-black focus:outline-none text-sm h-10"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(true)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Category Grid Dropdown Menu */}
        {isSearchDropdownOpen && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-[9999] max-h-96 overflow-y-auto mt-1">
            <div className="p-4">
              {/* All Categories Option */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setIsSearchDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors border-b border-gray-200"
                >
                  All Categories
                </button>
              </div>

              {/* Categories Grid */}
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setIsSearchDropdownOpen(false);
                        }}
                        className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                      >
                        {category.name}
                      </button>
                    </div>

                    {/* Subcategories Grid */}
                    {category.subCategories &&
                      category.subCategories.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                          {category.subCategories.map((subCategory: any) => (
                            <button
                              key={subCategory.id}
                              onClick={() => {
                                setSelectedCategory(subCategory.name);
                                setIsSearchDropdownOpen(false);
                                router.push(
                                  `/category/${category.slug}?sub=${subCategory.slug}&page=1`
                                );
                              }}
                              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-12 h-12 mb-2 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                {subCategory.icon ? (
                                  <img
                                    src={subCategory.icon}
                                    alt={subCategory.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-md flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {subCategory.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {/* Subcategory Name */}
                              <span className="text-xs text-gray-700 text-center leading-tight group-hover:text-gray-900">
                                {subCategory.name}
                              </span>
                            </button>
                          ))}

                          {category.subCategories.length > 0 && (
                            <button
                              onClick={() => {
                                setSelectedCategory(category.name);
                                setIsSearchDropdownOpen(false);
                                router.push(
                                  `/category/${category.slug}?page=1`
                                );
                              }}
                              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="w-12 h-12 mb-2 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Plus size={20} className="text-gray-500" />
                              </div>
                              <span className="text-xs text-gray-700 text-center leading-tight">
                                View All
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] max-h-96 overflow-y-auto mt-1">
            <div className="flex flex-col md:flex-row min-h-[300px] max-h-[400px]">
              <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">
                    {searchQuery || !searchResults?.isSuggested
                      ? "Suggestions"
                      : "Explore These Categories"}
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-[350px]">
                  {isSearching ? (
                    <div className="px-3 py-2 text-sm text-gray-700">
                      Searching...
                    </div>
                  ) : (
                    <div className="py-2">
                      {/* Categories */}
                      {(searchResults?.categories ?? []).length > 0 && (
                        <>
                          {searchResults?.categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() =>
                                handleResultClick(
                                  `/category/${category.slug}?page=1`
                                )
                              }
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {category.name}
                            </button>
                          ))}
                        </>
                      )}

                      {/* Subcategories */}
                      {(searchResults?.subCategories ?? []).length > 0 && (
                        <>
                          {searchResults?.subCategories?.map((subCategory) => (
                            <button
                              key={subCategory.id}
                              onClick={() =>
                                handleResultClick(
                                  `/category/${
                                    subCategory.category?.slug || "unknown"
                                  }?sub=${subCategory.slug}?page=1`
                                )
                              }
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {subCategory.name}
                            </button>
                          ))}
                        </>
                      )}

                      {(searchResults?.brands ?? []).length > 0 && (
                        <>
                          {searchResults?.brands?.map((brand) => (
                            <button
                              key={brand.id}
                              onClick={() =>
                                handleResultClick(`/brand/${brand.slug}?page=1`)
                              }
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {brand.name}
                            </button>
                          ))}
                        </>
                      )}

                      {searchQuery &&
                        !isSearching &&
                        (searchResults?.categories ?? []).length === 0 &&
                        (searchResults?.subCategories ?? []).length === 0 &&
                        (searchResults?.brands ?? []).length === 0 &&
                        (searchResults?.products ?? []).length === 0 && (
                          <div className="px-3 py-5 text-sm text-gray-500 text-center">
                            No suggestions found
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">
                    {searchQuery || !searchResults?.isSuggested
                      ? "Products"
                      : "Popular Products"}
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-[350px]">
                  {isSearching ? (
                    <div className="px-3 py-2 text-sm text-gray-700">
                      Loading products...
                    </div>
                  ) : (
                    <div className="py-2">
                      {(searchResults?.products ?? []).length > 0 ? (
                        <>
                          {searchResults?.products.map((product) => (
                            <button
                              key={product.id}
                              onClick={() =>
                                handleResultClick(`/product/${product.slug}`)
                              }
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                {product.variants[0]?.images[0] ? (
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <img
                                      src={product.variants[0].images[0].url}
                                      alt={product.name}
                                      className="w-8 h-8 object-contain rounded"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {product.name}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </>
                      ) : (
                        <>
                          {searchQuery &&
                            !isSearching &&
                            (searchResults?.products ?? []).length === 0 && (
                              <div className="px-3 py-5 text-sm text-gray-500 text-center">
                                No products found
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {(isSearchDropdownOpen || showSearchResults) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsSearchDropdownOpen(false);
              setShowSearchResults(false);
            }}
          />
        )}
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-black text-white transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg rounded-r-md`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="focus:outline-none p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-full p-4">
          {menuCategories.map((category, index) => (
            <div
              key={category.name}
              className={`${
                index !== menuCategories.length - 1
                  ? "border-b border-gray-700"
                  : ""
              } pb-2 mb-2`}
            >
              <div className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-gray-800 transition-colors">
                <Link
                  href={category.slug}
                  className="text-base font-medium text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {(category.items.length > 0 ||
                  (category.subItems &&
                    (Array.isArray(category.subItems)
                      ? category.subItems.length > 0
                      : Object.keys(category.subItems).length > 0))) && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCategory(category.name);
                    }}
                    className="focus:outline-none"
                  >
                    {openCategories.includes(category.name) ? (
                      <Minus size={16} className="text-gray-400" />
                    ) : (
                      <Plus size={16} className="text-gray-400" />
                    )}
                  </button>
                )}
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openCategories.includes(category.name)
                    ? "max-h-[1000px]"
                    : "max-h-0"
                }`}
              >
                <div className="pl-4 pt-2 space-y-2">
                  {category.items.map((item) => (
                    <div key={item.label}>
                      {category.name === "HOME APPLIANCES" &&
                      category.subItems &&
                      typeof category.subItems === "object" &&
                      !Array.isArray(category.subItems) &&
                      (category.subItems as Record<string, MenuItem[]>)[
                        item.label
                      ] ? (
                        <div>
                          <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-gray-800 transition-colors">
                            <Link
                              href={item.href}
                              className="text-sm text-gray-300"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.label}{" "}
                              {item.count !== undefined && `(${item.count})`}
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCategory(
                                  `${category.name}-${item.label}`
                                );
                              }}
                              className="focus:outline-none"
                            >
                              {openCategories.includes(
                                `${category.name}-${item.label}`
                              ) ? (
                                <Minus size={14} className="text-gray-400" />
                              ) : (
                                <Plus size={14} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              openCategories.includes(
                                `${category.name}-${item.label}`
                              )
                                ? "max-h-[1000px]"
                                : "max-h-0"
                            }`}
                          >
                            {category.subItems &&
                              typeof category.subItems === "object" &&
                              !Array.isArray(category.subItems) &&
                              (category.subItems as Record<string, MenuItem[]>)[
                                item.label
                              ] && (
                                <div className="pl-4 pt-2 space-y-1 flex flex-col gap-2">
                                  {(
                                    category.subItems as Record<
                                      string,
                                      MenuItem[]
                                    >
                                  )[item.label].map((subItem) => (
                                    <Link
                                      key={subItem.label}
                                      href={subItem.href}
                                      className="block text-xs text-gray-300 hover:text-white hover:underline transition-colors"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {subItem.label}{" "}
                                      {subItem.count !== undefined &&
                                        `(${subItem.count})`}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="block text-sm py-1 px-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}{" "}
                          {item.count !== undefined && `(${item.count})`}
                        </Link>
                      )}
                    </div>
                  ))}
                  {category.subItems &&
                    Array.isArray(category.subItems) &&
                    category.subItems.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold text-gray-400">
                          {category.name === "ELECTRONICS"
                            ? "Air Coolers"
                            : category.name === "COMPUTER & PRINTER"
                            ? "Computer Accessories"
                            : "Top Categories"}
                        </h4>
                        <div className="pl-4 pt-2 space-y-1">
                          {category.subItems.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block text-sm py-1 px-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.label}{" "}
                              {subItem.count !== undefined &&
                                `(${subItem.count})`}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
