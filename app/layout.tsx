import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { geistSans } from "@/lib/fonts/geist";
import { cn } from "@/lib/utils";
import ContextProvider from "@/providers/ContextProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ordena",
  description: "Plataforma acadêmica de organização.",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      suppressHydrationWarning
      className={cn("h-full antialiased bg-background", geistSans.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ContextProvider>{children}</ContextProvider>
          <Toaster position="top-center" richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
