import React from "react";
import { ChevronRight, MapPin, ShoppingCart, User, Menu } from "lucide-react";

const Banneers = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="bg-black text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-semibold">
            croma<span className="text-green-400">⎯</span>
          </span>
          <Menu className="w-6 h-6" />
          <span className="hidden md:inline">Menu</span>
        </div>
        <input
          type="text"
          placeholder="What are you looking for ?"
          className="w-[40%] px-4 py-2 rounded-md outline-none text-black"
        />
        <div className="flex items-center gap-4">
          <MapPin className="w-5 h-5" />
          <span>Mumbai, 400049</span>
          <User className="w-5 h-5" />
          <ShoppingCart className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-[#121212] text-white px-6 py-3 text-sm flex items-center gap-2">
        <span className="text-gray-400">Televisions & Accessories</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-bold">LED TVs</span>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-white to-green-100 flex flex-col md:flex-row items-center justify-between px-10 py-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">4K QLED TVs</h1>
          <p className="text-xl font-medium">
            Starting at <span className="text-black font-bold">₹28,999</span>
          </p>
        </div>
        <img
          src="https://images.samsung.com/is/image/samsung/p6pim/in/qa55q60bakxxl/gallery/in-qled-q60b-qa55q60bakxxl-533513017?$1300_1038_PNG$"
          alt="QLED TV"
          className="w-[400px] mt-10 md:mt-0"
        />
      </div>
    </div>
  );
};

export default Banneers;
