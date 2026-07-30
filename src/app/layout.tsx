import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Figtree } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tanNimbus = localFont({
  src: "../fonts/TAN-NIMBUS.otf",
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Social Project — One Question, Every Night",
  description:
    "One honest question every night. Answer it, and the circle opens — see what everyone else said. A nightly ritual for real connection.",
  metadataBase: new URL("https://main.d1jaykgbbddd26.amplifyapp.com"),
  openGraph: {
    title: "The Social Project — One Question, Every Night",
    description:
      "One honest question every night. Answer it, and the circle opens. A nightly ritual for real connection.",
    url: "https://main.d1jaykgbbddd26.amplifyapp.com",
    siteName: "The Social Project",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Social Project — One Question, Every Night",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Social Project — One Question, Every Night",
    description:
      "One honest question every night. Answer it, and the circle opens. A nightly ritual for real connection.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${tanNimbus.variable} ${instrumentSerif.variable} ${figtree.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
