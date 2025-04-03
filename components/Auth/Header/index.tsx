"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-[calc(100vw-60px)] max-sm:w-full rounded-xl py-4 my-8 mx-auto px-6 flex items-center justify-between bg-purple-920 ">
      <Link
        href="/"
        className="text-2xl max-sm:text-xl font-bold text-white z-20"
      >
        Dream AI
      </Link>

      <div className="flex gap-3 z-20">
        <Link href="/signin">
          <Button
            variant="outline"
            className="bg-transparent border-white text-black bg-white hover:bg-gray-100 "
          >
            Log In
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-gray-800 border border-gray-200 text-white hover:bg-gray-700">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}
