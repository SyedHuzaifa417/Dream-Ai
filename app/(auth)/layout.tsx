import "../globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Auth/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Toaster />
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
