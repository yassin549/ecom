import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { NProgressProvider } from "@/components/providers/nprogress-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/loading/page-loader";
import { AnimatedBackground } from "@/components/background/animated-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopHub - Votre Destination Shopping Ultime",
  description: "Découvrez des produits incroyables en électronique, mode, décoration et plus encore. Produits de qualité à des prix imbattables avec livraison rapide.",
  keywords: ["ecommerce", "shopping", "boutique en ligne", "électronique", "mode", "décoration", "tunisie"],
  authors: [{ name: "ShopHub" }],
  openGraph: {
    title: "ShopHub - Votre Destination Shopping Ultime",
    description: "Découvrez des produits incroyables en électronique, mode, décoration et plus encore.",
    type: "website",
    locale: "fr_TN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub - Votre Destination Shopping Ultime",
    description: "Découvrez des produits incroyables en électronique, mode, décoration et plus encore.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageLoader />
        <AnimatedBackground />
        <QueryProvider>
          <ThemeProvider defaultTheme="light" storageKey="shophub-theme">
            <NProgressProvider>
              <div className="flex min-h-screen flex-col relative">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </NProgressProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
