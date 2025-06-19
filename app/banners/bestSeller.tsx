import React from 'react';
import { FaStar, FaRegHeart } from 'react-icons/fa';

const products = [
  {
    id: 1,
    title: 'TCL C655 109.22 cm (43 inch) QLED 4K Ultra HD',
    image: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1738250068/Croma%20Assets/Entertainment/Television/Images/306516_0_illijz.png?tr=w-720',
    price: 27990,
    mrp: 61990,
    rating: 4,
  },
  {
    id: 2,
    title: 'SAMSUNG Series 5 108 cm (43 inch) Full HD LED Tizen',
    image: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1738247703/Croma%20Assets/Entertainment/Television/Images/261175_0_h4ptfi.png?tr=w-720',
    price: 23490,
    mrp: 37900,
    rating: 5,
  },
  {
    id: 3,
    title: 'TOSHIBA C350NP 108 cm (43 inch) 4K Ultra HD LED',
    image: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1738247703/Croma%20Assets/Entertainment/Television/Images/261175_0_h4ptfi.png?tr=w-720',
    price: 23999,
    mrp: 44999,
    rating: 0,
  },
  {
    id: 4,
    title: 'Xiaomi A Series 80 cm (32 inch) HD Ready LED Smart',
    image: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1738247703/Croma%20Assets/Entertainment/Television/Images/261175_0_h4ptfi.png?tr=w-720',
    price: 11999,
    mrp: 24999,
    rating: 5,
  },
  
];

const BestsellerSection = () => {
  return (
    <section className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Bestseller</h2>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative min-w-[250px] max-w-[280px] bg-[#111] rounded-lg p-4 flex-shrink-0"
            >
              {/* Heart icon */}
              <button className="absolute top-3 right-3 text-white">
                <FaRegHeart size={20} />
              </button>

              {/* Image */}
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-44 object-contain mb-4"
              />

              {/* Title */}
              <h3 className="text-sm font-medium mb-2 line-clamp-2">
                {product.title}
              </h3>

              {/* Price */}
              <div className="text-lg font-semibold">
                ₹{product.price.toLocaleString()}{' '}
                <span className="line-through text-gray-400 text-sm ml-1">
                  ₹{product.mrp.toLocaleString()}
                </span>
              </div>

              {/* Ratings */}
              <div className="mt-2 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={16}
                    className={`mr-1 ${
                      i < product.rating ? 'text-green-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestsellerSection;
