import React from "react";
import { Container } from "@/components/ui/container";

export function Bank() {
  return (
    <Container>
      <div className="space-y-10 pb-20 mt-20">
        <div className="flex flex-col gap-y-4 md:gap-y-12 px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold ">Exciting Bank Offers</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <img
              src="/assets/offers/offer1.webp"
              className="rounded-lg shadow-xl w-full sm:w-[300px] md:w-[400px] lg:w-[500px]"
              alt="Bank Offer 1"
            />
            <img
              src="/assets/offers/offer1.webp"
              className="rounded-lg shadow-xl w-full sm:w-[300px] md:w-[400px] lg:w-[500px]"
              alt="Bank Offer 2"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
