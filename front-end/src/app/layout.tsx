import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { authStorage } from "@/api-actions/authStorage";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JourneyLink",
  description:
    "JourneyLink connects drivers with passengers for cost-sharing rides, promoting eco-friendly, efficient, and trusted intercity travel ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = authStorage.getAccessToken();

  return (
    <html lang="en">
      <body
        className={`flex min-h-screen w-full flex-col ${geistSans.variable} ${geistMono.variable}`}
      >
        <Providers hasAccessToken={Boolean(token)}>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
