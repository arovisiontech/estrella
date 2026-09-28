import type { Metadata } from "next";
import { Albert_Sans, Poppins } from "next/font/google";
import { CartProvider } from "@/lib/cart/CartContext";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
});

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url && typeof url === "string" && url.trim().length > 0) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://estrella-international.com";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Estrella - Enterprise Solutions & Business Inquiry Portal",
  description:
    "Premier corporate manufacturing, bulk inquiries, enterprise distribution, and custom product development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${albertSans.variable} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}