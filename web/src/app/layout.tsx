import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miquel A. Riudavets Mercadal | Pintura i Reformes",
  description: "Serveis professionals de pintura i reformes a Menorca. Qualitat, experiència i confiança per a la teva llar o negoci.",
  keywords: ["pintura", "reformes", "Menorca", "rehabilitació", "decoració", "Miquel Riudavets"],
  authors: [{ name: "Miquel A. Riudavets Mercadal" }],
  openGraph: {
    title: "Miquel A. Riudavets Mercadal | Pintura i Reformes",
    description: "Serveis professionals de pintura i reformes a Menorca",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
