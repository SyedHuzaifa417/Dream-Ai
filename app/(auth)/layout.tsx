import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Auth/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dream AI - Authentication",
  description: "Sign in or create an account for Dream AI",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen bg-fixed-pattern overflow-hidden">
          <Header />
          <div className="relative z-10 h-[calc(100vh-10rem)] flex items-center justify-center">
            <main className="w-[calc(100vw-150px)] max-sm:w-[calc(100vw-40px)] ">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
