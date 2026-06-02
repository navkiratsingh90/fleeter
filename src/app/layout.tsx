import type { Metadata } from "next";
import { Syne, DM_Sans, Roboto } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InitUser from "@/InitUser";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "Veloce",
  description: "Multi-Vendor Ride Sharing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${roboto.variable}`}
    >
      <body className={`${roboto.className} bg-[#0a0a0a]  text-white antialiased`}>
        <Provider children={children}/>

      </body>
    </html>
  );
}