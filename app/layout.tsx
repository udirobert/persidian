import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://persidian.com"),
  title: "Persidian — Autonomous agents for the work that compounds",
  description:
    "Persidian builds autonomous agents that watch the compounding risks inside a business — cash, outreach, signals, data — and act before the damage scales.",
  openGraph: {
    title: "Persidian — Autonomous agents for the work that compounds",
    description:
      "Persidian builds autonomous agents that watch the compounding risks inside a business — cash, outreach, signals, data — and act before the damage scales.",
    type: "website",
    url: "https://persidian.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Persidian — Autonomous agents for the work that compounds",
    description:
      "Persidian builds autonomous agents that watch the compounding risks inside a business — cash, outreach, signals, data — and act before the damage scales.",
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
      className={`${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
