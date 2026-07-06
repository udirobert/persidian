import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://persidian.com"),
  title: "Persidian",
  description:
    "Persistence + circadian. Small, dependable software for businesses that run every day.",
  openGraph: {
    title: "Persidian",
    description:
      "Persistence + circadian. Small, dependable software for businesses that run every day.",
    type: "website",
    url: "https://persidian.com",
  },
  twitter: {
    card: "summary",
    title: "Persidian",
    description:
      "Persistence + circadian. Small, dependable software for businesses that run every day.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
