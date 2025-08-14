import type { Metadata } from "next";
// Import the new fonts from next/font/google
import { Poppins, Lato } from "next/font/google";
import Navbar from "@/components/Navbar";
import "@/globals.css";
import Footer from "@/components/Footer";

// Configure the fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Load different weights for headings
  variable: "--font-poppins", // Assign a CSS variable
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // Load regular and bold
  variable: "--font-lato", // Assign a CSS variable
});

export const metadata: Metadata = {
  title: "Familienettverk",
  description: "Connecting families, building community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      {/* Apply the font variables to the body */}
      <body className={`${poppins.variable} ${lato.variable}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
