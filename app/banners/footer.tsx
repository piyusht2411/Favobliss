import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-5 md:px-16">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left Section - Email + Icons */}
        <div className="flex flex-col gap-6 w-full md:max-w-xs">
          <div>
            <h3 className="uppercase font-bold mb-3 text-sm md:text-base">Connect With Us</h3>
            <div className="bg-white rounded-md p-2 flex items-center">
              <input
                type="email"
                placeholder="Enter Email ID"
                className="flex-1 text-black outline-none text-sm px-2"
              />
              <span className="text-black font-bold text-xl ml-2">→</span>
            </div>
          </div>
          <div className="flex gap-4 text-xl">
            <FaYoutube />
            <FaFacebookF />
            <FaInstagram />
            <FaLinkedinIn />
            <FaTwitter />
          </div>
        </div>

        {/* Right Section - Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full text-sm">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-2">
            <h3 className="uppercase font-bold mb-2">Useful Links</h3>
            <p>About Croma</p>
            <p>Help And Support</p>
            <p>FAQs</p>
            <p>Buying Guide</p>
            <p>Return Policy</p>
            <p>B2B Orders</p>
            <p>Store Locator</p>
            <p>E-Waste</p>
            <p>Franchise Opportunity</p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2">
            <h3 className="invisible mb-2">-</h3>
            <p>Site Map</p>
            <p>Careers At Croma</p>
            <p>Terms Of Use</p>
            <p>Disclaimer</p>
            <p>Privacy Policy</p>
            <p>Unboxed</p>
            <p>Gift Card</p>
            <p>Croma E-Star</p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-2">
            <h3 className="uppercase font-bold mb-2">Products</h3>
            <p>Televisions & Accessories</p>
            <p>Home Appliances</p>
            <p>Phones & Wearables</p>
            <p>Computers & Tablets</p>
            <p>Kitchen Appliances</p>
            <p>Audio & Video</p>
            <p>Health & Fitness</p>
            <p>Grooming & Personal Care</p>
            <p>Cameras & Accessories</p>
            <p>Smart Devices</p>
            <p>Gaming</p>
            <p>Accessories</p>
            <p>Top Brands</p>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-10 text-center text-xs md:text-sm">
        © Copyright 2025 Croma. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
