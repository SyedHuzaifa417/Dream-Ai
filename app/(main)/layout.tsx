"use client";

import Sidebar from "@/components/Main/components/sidebar";
import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen bg-fixed-pattern overflow-hidden flex">
          <Sidebar />
          <main className=" w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
