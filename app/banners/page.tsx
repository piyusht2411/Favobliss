// components/LEDTVBanner.tsx
import React from 'react';
import { ChevronRight, MapPin, ShoppingCart, User, Menu } from 'lucide-react';
import BestsellerSection from './bestSeller';


const Banners = () => {
  return (
    <div className="w-full bg-white">
      {/* Top Navbar */}
   

      {/* Breadcrumb */}
      <div className="bg-[#121212] text-white px-4 sm:px-6 py-2 text-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-gray-400 whitespace-nowrap">Televisions & Accessories</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-bold whitespace-nowrap">LED TVs</span>
      </div>

      {/* Hero Banner */}
      <div className="w-full bg-white">
      {/* Hero Section with background image */}
      <div
        className="w-full h-[400px] sm:h-[500px] bg-cover bg-center relative flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1697092979/Croma%20Assets/CMS/PCP/Oct-2023/PCP-Main/Updated%20PCPs/TVs/MPCP_TV_11oct2023_q6mgg0.png?tr=w-1000')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Text content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">4K QLED TVs</h1>
          <p className="text-lg sm:text-2xl font-semibold">
            Starting at <span className="text-green-400 font-bold">₹28,999</span>
          </p>
        </div>
      </div>
    </div>
    <BestsellerSection />
  
    </div>
  );
};

export default Banners;
