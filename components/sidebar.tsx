"use client";

import { Button } from "@/components/ui/button";
import {
  Search,
  VideoIcon,
  History,
  HelpCircle,
  Settings2,
  LogOut,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Search, label: "Explore", href: "/" },
    { icon: VideoIcon, label: "Video Generation", href: "/video" },
    { icon: History, label: "History", href: "/history" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: Settings2, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="w-[240px] rounded-[20px] m-3 p-4 flex flex-col border border-royalIndigo">
      <Link href="/" className="text-[#4B3979] text-xl font-semibold mb-6">
        Dream AI
      </Link>

      <div className="space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-gray-600 hover:bg-[#f8f7fd] hover:text-[#4B3979] border border-royalIndigo ${
                  isActive ? "bg-[#f8f7fd] text-[#4B3979]" : ""
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}

        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-[#f8f7fd] hover:text-[#4B3979] border border-royalIndigo"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="mt-auto flex items-center justify-center gap-3 py-2 rounded-lg bg-white">
        <span className="text-sm font-medium">Jessica Smith</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://s3-alpha-sig.figma.com/img/891f/f665/4cabb52b14cb062ef4178cdbf1e04781?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PzaRre0nkw1KM-inermkip96p4JVNIp5ZYtAAEuJiN7oh1xGxiFmWnvn6dCY7u9zk~SWSzVSlXv2R36ap0UAQcswVhtuQkv5nUkDP0yEsDcNA92S2cM-4Oe0uDehTPHhQulewiHGyC-CUmxmxTxdN0UF-y3FYRSctKF0g7dV6ITgUi16XNRQgPRmh0ucJzm0aRhy-RhCH2JUfO8Jz~oYDG9xXzFQogyuVkLLvjy57yQKU3AU5SCpAbKzlgsa77L7MpSkKmsQ2F211P26EcX5mCOAupawCudMgmK4U0H68CQAsG~U4palYQexLtmdYJ5MLjJBGC3iEfZi7zhOYSqBPw__" />
        </Avatar>
      </div>
    </div>
  );
}
