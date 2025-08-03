import React from "react";
import Image from "next/image";

interface Offer {
  bank: string;
  logo: string;
  description: string;
}

const offers: Offer[] = [
  {
    bank: "ICICI Bank",
    logo: "/icici.webp",
    description:
      "Rs.4500 instant discount on ICICI Bank Credit Card with cart value above Rs.10000/-post clicking...",
  },
  {
    bank: "IDFC Bank",
    logo: "/icici.webp",
    description:
      "10% Upto Rs 5000 instant discount on IDFC BANK Credit Card EMI with cart value above Rs 5,000/-...",
  },
  {
    bank: "HDFC Bank",
    logo: "/icici.webp",
    description:
      "Instant discount of 10% up to Rs 2500 on HDFC Bank Credit Card EMI for cart values above Rs 10,000...",
  },
  {
    bank: "HDFC Bank",
    logo: "/icici.webp",
    description:
      "Instant discount of 10% up to Rs 2500 on HDFC Bank Credit Card EMI for cart values above Rs 10,000...",
  },
];

const BankOffers: React.FC = () => {
  return (
    <div className="text-black py-4 rounded-lg max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-2">
        Super Savings (4 OFFERS)
      </h2>
      <div
        className="flex gap-4 overflow-x-auto"
        style={{
          scrollbarWidth: "thin", // Firefox
          msOverflowStyle: "auto", // IE/Edge
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            height: 6px; /* horizontal scrollbar height */
          }

          div::-webkit-scrollbar-track {
            background: transparent;
          }

          div::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
          }
        `}</style>
        {offers.map((offer, idx) => (
          <div
            key={idx}
            className="min-w-[205px] p-4 border border-gray-300 rounded-lg bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={offer.logo}
                alt={`${offer.bank} logo`}
                width={24}
                height={24}
              />
              <span className="font-medium">{offer.bank}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">
              {offer.description}
            </p>
            <a
              href="#"
              className="text-sm text-blue-400 underline mt-2 inline-block"
            >
              View more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankOffers;
