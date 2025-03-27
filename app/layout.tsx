import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dream AI",
  description: "AI-powered image and video generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative h-screen bg-orchid overflow-hidden">
          {/* Background circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 border border-slate-950 rounded-full mix-blend-multiply  blur-sm"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-slate-950 rounded-full mix-blend-multiply  blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-slate-950 rounded-full mix-blend-multiply  blur-sm "></div>
          </div>

          {/* Main content */}
          <div className="relative flex">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
