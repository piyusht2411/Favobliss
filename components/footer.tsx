"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { Category } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  categories: Category[];
}

export const Footer = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const { categories } = props;
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}?page=1`);
  };

  const handleSubCategoryClick = (
    categorySlug: string,
    subCategorySlug: string
  ) => {
    router.push(`/category/${categorySlug}?sub=${subCategorySlug}?page=1`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Section - Email + Social */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-wide text-white/90">
                Stay Connected
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Subscribe to our newsletter for the latest updates and exclusive
                offers.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  <span className="text-xl font-bold">→</span>
                </button>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: FaYoutube, color: "hover:text-red-500" },
                  { icon: FaFacebookF, color: "hover:text-blue-500" },
                  { icon: FaInstagram, color: "hover:text-pink-500" },
                  { icon: FaLinkedinIn, color: "hover:text-blue-600" },
                  { icon: FaTwitter, color: "hover:text-sky-400" },
                ].map(({ icon: Icon, color }, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 ${color} transition-all duration-300 hover:bg-white/20 hover:scale-110 cursor-pointer`}
                  >
                    <Icon className="text-sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Column 1 - Company Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/10">
                Company
              </h3>
              <div className="grid gap-3 text-sm">
                {[
                  "Site Map",
                  "Careers At Favobliss",
                  "Terms Of Use",
                  "Disclaimer",
                  "Privacy Policy",
                  "Unboxed",
                  "Gift Card",
                  "Favobliss E-Star",
                ].map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 - Products */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90 pb-2 border-b border-white/10">
                Products
              </h3>
              <div className="grid gap-3 text-sm">
                {[
                  "Televisions & Accessories",
                  "Home Appliances",
                  "Phones & Wearables",
                  "Computers & Tablets",
                  "Kitchen Appliances",
                  "Audio & Video",
                  "Health & Fitness",
                  "Grooming & Personal Care",
                  "Cameras & Accessories",
                  "Smart Devices",
                  "Gaming",
                  "Accessories",
                  "Top Brands",
                ].map((product, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
                  >
                    {product}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.id} className="space-y-4">
                  {/* Category Header */}
                  <h3
                    className="text-sm font-bold text-white uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors duration-200"
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    {category.name}
                  </h3>

                  {/* Subcategories */}
                  {category.subCategories &&
                    category.subCategories.length > 0 && (
                      <div className="text-xs text-gray-400 leading-relaxed">
                        {category.subCategories.map((subCategory, index) => (
                          <span key={subCategory.id}>
                            <span
                              className="hover:text-white cursor-pointer transition-colors duration-200"
                              onClick={() =>
                                handleSubCategoryClick(
                                  category.slug,
                                  subCategory.slug
                                )
                              }
                            >
                              {subCategory.name}
                            </span>
                            {category.subCategories &&
                              index < category.subCategories.length - 1 && (
                                <span className="mx-2 text-gray-600">|</span>
                              )}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Original Divider */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Favobliss. All rights reserved
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <span className="hover:text-gray-300 cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="hover:text-gray-300 cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span className="hover:text-gray-300 cursor-pointer transition-colors">
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
