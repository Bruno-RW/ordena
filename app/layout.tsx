import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ordena",
  description: "Plataforma acadêmica de organização.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="pt" className={cn("h-full antialiased", geistSans.variable)}>
      <body className="min-h-full flex flex-col">
        {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
        <Toaster position="top-center" theme="light" richColors={true} />
      </body>
    </html>
  );
}
