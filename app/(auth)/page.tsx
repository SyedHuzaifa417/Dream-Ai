"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function Home() {
  return (
    <div className="relative  w-full bg-pattern">
      <div className="relative z-10 flex flex-col items-center justify-center  p-6 text-center">
        <div className=" bg-white/95 backdrop-blur-lg p-8 rounded-3xl border border-white/20 flex items-center justify-center flex-col">
          <h1 className="text-3xl max-sm:text-xl mb-3 text-gray-800">
            Welcome to Dream AI - where you can turn your ideas into stunning
            videos effortlessly.
          </h1>
          <p className="text-3xl  max-sm:text-xl mb-10 text-gray-800">
            Start creating and bring your vision to life today!
          </p>
          <Link href="/explore">
            <Button className="bg-purple-920 hover:bg-blue-800 text-white py-8 px-8 max-sm:px-4 rounded-lg text-lg flex items-center justify-center">
              Get Started for Free -
              <AiOutlineArrowRight className=" w-6 h-6 mt-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
