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
  title: "Persidian — A portfolio of autonomous enterprise products",
  description:
    "Four live products, one studio capability. Sikizana, Nuncio, Lenitnes, and DataBard are autonomous agents that watch compounding business risks and act before the damage scales.",
  openGraph: {
    title: "Persidian — A portfolio of autonomous enterprise products",
    description:
      "Four live products, one studio capability. Sikizana, Nuncio, Lenitnes, and DataBard are autonomous agents that watch compounding business risks and act before the damage scales.",
    type: "website",
    url: "https://persidian.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Persidian — A portfolio of autonomous enterprise products",
    description:
      "Four live products, one studio capability. Sikizana, Nuncio, Lenitnes, and DataBard are autonomous agents that watch compounding business risks and act before the damage scales.",
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
