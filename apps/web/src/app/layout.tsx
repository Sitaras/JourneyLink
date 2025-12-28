import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { authStorage } from "@/lib/authStorage";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./layout.module.css";
import { initLingui, allMessages } from "@/lib/appRouterI18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoPassengers",
  description:
    "CoPassengers connects drivers with passengers for cost-sharing rides, promoting eco-friendly, efficient, and trusted intercity travel ",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await authStorage.getAccessToken();
  const refreshToken = await authStorage.getRefreshToken();

  const i18n = await initLingui();
  const locale = i18n.locale;

  return (
    <html lang={locale}>
      <body
        className={`flex min-h-screen w-full flex-col ${geistSans.variable} ${geistMono.variable}`}
      >
        <Toaster richColors />
        <Providers
          initialHasToken={Boolean(token) || Boolean(refreshToken)}
          initialMessages={allMessages[locale]}
          initialLocale={locale}
        >
          <main className={styles.page}>
            <div className={styles.container}>
              <Navbar />
              <main className={styles.main}>{children}</main>
            </div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
