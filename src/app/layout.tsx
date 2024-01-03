import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "react-loading-skeleton/dist/skeleton.css";
const inter = Inter({ subsets: ["latin"] });
import 'simplebar-react/dist/simplebar.min.css'
import { Toaster } from "@/components/ui/toaster"
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen font-sans dark:bg-blend-darken  antialiased grainy  ",
          inter.className
        )}
      >
        <Providers>
          <Toaster />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
