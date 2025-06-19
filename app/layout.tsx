import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { FlowbiteProvider } from "@/providers/flowbite";
import Script from "next/script";

const inter = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Favobliss – Your One-Stop Shop for the Latest Electronics",
  keywords: [
    "Electronics online, buy electronics, smartphones, home appliances, gadgets, top brands, best deals, fast delivery, online shopping, Favobliss",
  ],
  description:
    "Favobliss Explore a wide range of smartphones, home appliances, and more from top brands at unbeatable prices. Fast delivery &amp; great deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/assets/favicon.ico" sizes="any" />
      <body className={inter.className}>
        <SessionProvider
          refetchInterval={5 * 60} // Refresh session every 5 minutes
          refetchOnWindowFocus={true}
        >
          <ModalProvider />
          <FlowbiteProvider />
          <Toaster position="bottom-right" />
          <Navbar />
          {children}
          <Footer />
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </SessionProvider>
      </body>
    </html>
  );
}
