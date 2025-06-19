import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const emiOptions = [
  { duration: "1 Year", price: "₹2529 or ₹211/month" },
  { duration: "2 Years", price: "₹4529 or ₹189/month" },
  { duration: "3 Years", price: "₹5999 or ₹167/month" },
];

const ZipCarePlan: React.FC = () => {
  const [selectedEmi, setSelectedEmi] = useState(0);

  return (
    <div className="bg-white text-black p-6 rounded-2xl border border-gray-300 w-full max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-start">
          <img src="/zipcare.webp" alt="ZipCare" className="w-12 h-12" />
          <div>
            <h2 className="font-semibold text-black">
              ZipCare Protect - Advanced
            </h2>
            <p className="text-gray-600 text-sm">
              Starting at just <span className="font-semibold">₹170/month</span>
            </p>
          </div>
        </div>
        <a href="#" className="text-teal-600 text-sm hover:underline">
          Learn more
        </a>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 my-6 border-t border-gray-300 pt-6">
        {[
          { label: "Extends your Device's Life", icon: "⏱️" },
          { label: "Protection against sudden malfunctions", icon: "🛡️" },
          { label: "Genuine Spare parts", icon: "⚙️" },
          { label: "Cashless Service", icon: "🏅" },
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl text-indigo-800">
              {item.icon}
            </div>
            <p className="text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* EMI Dropdown */}
      <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer mb-4">
        {/* <div>
          <p className="font-semibold">{emiOptions[selectedEmi].duration}</p>
          <p className="text-sm text-gray-600">
            {emiOptions[selectedEmi].price}
          </p>
        </div> */}
        <select
          className="bg-transparent text-black outline-none"
          value={selectedEmi}
          onChange={(e) => setSelectedEmi(parseInt(e.target.value))}
        >
          {emiOptions.map((option, index) => (
            <option key={index} value={index} className="text-black">
              {option.duration} - {option.price}
            </option>
          ))}
        </select>
      </div>

      {/* Button */}
      <button className="w-full bg-emerald-400 text-black font-semibold py-2 rounded-full hover:bg-emerald-600 transition">
        Select Plan
      </button>
    </div>
  );
};

export default ZipCarePlan;
