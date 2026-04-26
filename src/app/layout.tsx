import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "KeepIt — Receipts Fade. KeepIt Doesn't.",
  description: "Never lose a warranty again. Track, manage, and verify all your product warranties in one place with KeepIt.",
  keywords: ["warranty", "receipt", "tracker", "product", "management", "QR code"],
  authors: [{ name: "KeepIt" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#1565C0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        <AppProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
