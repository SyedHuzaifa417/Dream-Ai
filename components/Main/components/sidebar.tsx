"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Search, History, HelpCircle, LogOut, Menu, X } from "lucide-react";
import { VscSparkle } from "react-icons/vsc";
import { LiaCrownSolid } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobilePopoverOpen, setIsMobilePopoverOpen] = useState(false);
  const [isDesktopPopoverOpen, setIsDesktopPopoverOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobilePopoverClose = () => {
    setIsMobilePopoverOpen(false);
  };

  const handleLogout = () => {
    // Handle logout functionality
    setIsMobilePopoverOpen(false);
    setIsDesktopPopoverOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Navbar*/}
      <div
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 hidden items-center justify-between p-4 bg-black border-white max-sm:flex",
          isMobileMenuOpen ? "border-b" : ""
        )}
      >
        <Link href="/" className="text-white text-xl font-semibold">
          Dream Ai
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="text-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm max-sm:block hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile  */}
      <div
        ref={sidebarRef}
        className={clsx(
          "fixed top-0 left-0 h-full z-40 bg-gray-950/90 pt-16 hidden max-sm:block border-r-4 border-gray-900 w-3/4",
          "transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col items-center space-y-5 mt-10 h-full">
          <Link
            href="/videos"
            className="w-full px-4"
            onClick={toggleMobileMenu}
          >
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/videos" ? "bg-indigo-650" : ""
              }`}
            >
              Video Generation
              <VscSparkle className="ml-2 w-6 h-6" />
            </Button>
          </Link>

          <Link
            href="/images"
            className="w-full px-4"
            onClick={toggleMobileMenu}
          >
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/images" ? "bg-indigo-650" : ""
              }`}
            >
              Image Generation
              <Search className="ml-2 size-6" />
            </Button>
          </Link>

          <div className="w-full border-b" />

          <Link
            href="/subscriptions"
            className="w-full px-4"
            onClick={toggleMobileMenu}
          >
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/subscriptions" ? "bg-indigo-650" : ""
              }`}
            >
              Subscription
              <LiaCrownSolid className="ml-2 w-6 h-6" />
            </Button>
          </Link>

          <Link
            href="/history"
            className="w-full px-4"
            onClick={toggleMobileMenu}
          >
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/history" ? "bg-indigo-650" : ""
              }`}
            >
              History
              <History className="ml-2 size-6" />
            </Button>
          </Link>

          <div className="w-full border-b" />

          <Link href="/help" className="w-full px-4" onClick={toggleMobileMenu}>
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/help" ? "bg-indigo-650" : ""
              }`}
            >
              Help
              <HelpCircle className="ml-2 size-6" />
            </Button>
          </Link>

          <Link
            href="/settings"
            className="w-full px-4"
            onClick={toggleMobileMenu}
          >
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/settings" ? "bg-indigo-650" : ""
              }`}
            >
              Settings
              <LuSettings className="ml-2 w-6 h-6" />
            </Button>
          </Link>

          <div className="w-full px-4">
            <Button
              variant="ghost"
              className="w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border"
            >
              Logout
              <LogOut className="ml-2 size-6" />
            </Button>
          </div>

          <div className="w-full px-4 mt-auto mb-5 absolute bottom-5 left-0 right-0">
            <Popover
              open={isMobilePopoverOpen}
              onOpenChange={setIsMobilePopoverOpen}
            >
              <PopoverTrigger asChild>
                <div className="flex items-center justify-center gap-5 py-2 rounded-lg border cursor-pointer hover:bg-indigo-650">
                  <span className="text-base font-medium text-white">
                    Jessica Smith
                  </span>
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="https://s3-alpha-sig.figma.com/img/891f/f665/4cabb52b14cb062ef4178cdbf1e04781?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PzaRre0nkw1KM-inermkip96p4JVNIp5ZYtAAEuJiN7oh1xGxiFmWnvn6dCY7u9zk~SWSzVSlXv2R36ap0UAQcswVhtuQkv5nUkDP0yEsDcNA92S2cM-4Oe0uDehTPHhQulewiHGyC-CUmxmxTxdN0UF-y3FYRSctKF0g7dV6ITgUi16XNRQgPRmh0ucJzm0aRhy-RhCH2JUfO8Jz~oYDG9xXzFQogyuVkLLvjy57yQKU3AU5SCpAbKzlgsa77L7MpSkKmsQ2F211P26EcX5mCOAupawCudMgmK4U0H68CQAsG~U4palYQexLtmdYJ5MLjJBGC3iEfZi7zhOYSqBPw__" />
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-52 border border-white p-0 bg-inherit hidden max-sm:block">
                <div className="space-y-1">
                  <Link
                    href="/account"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleMobilePopoverClose();
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-indigo-650 hover:text-white rounded-none"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Account Settings
                    </Button>
                  </Link>
                  <div className="border-b border-white my-1" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-indigo-650 hover:text-white rounded-none"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Desktop  */}
      <div className="w-[240px] rounded-[20px] m-3 flex-col border border-white flex max-sm:hidden">
        <Link
          href="/"
          className="text-white text-2xl font-semibold mt-9 text-center"
        >
          Dream Ai
        </Link>

        <div className="border-b border-white mt-5" />

        <div className="space-y-5 flex flex-col items-center justify-center mt-6 w-full">
          <Link href="/videos" className="w-full px-4 ">
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/videos" ? "bg-indigo-650" : ""
              }`}
            >
              Video Generation
              <VscSparkle className="ml-2 w-6 h-6" />
            </Button>
          </Link>

          <Link href="/images" className="w-full px-4">
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/images" ? "bg-indigo-650" : ""
              }`}
            >
              Image Generation
              <Search className="ml-2 size-6" />
            </Button>
          </Link>

          <div className="w-full border-b" />

          <Link href="/subscriptions" className="w-full px-4">
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/subscriptions" ? "bg-indigo-650" : ""
              }`}
            >
              Subscription
              <LiaCrownSolid className="ml-2 w-6 h-6" />
            </Button>
          </Link>

          <Link href="/history" className="w-full px-4">
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/history" ? "bg-indigo-650" : ""
              }`}
            >
              History
              <History className="ml-2 size-6" />
            </Button>
          </Link>

          <div className="w-full border-b" />

          <Link href="/help" className="w-full px-4">
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/help" ? "bg-indigo-650" : ""
              }`}
            >
              Help
              <HelpCircle className="ml-2 size-6" />
            </Button>
          </Link>

          <Link href="/settings" className="w-full px-4">
            <Button
              variant="ghost"
              className={`w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border ${
                pathname === "/settings" ? "bg-indigo-650" : ""
              }`}
            >
              Settings
              <LuSettings className="ml-2 w-6 h-6" />
            </Button>
          </Link>

          <div className="w-full px-4">
            <Button
              variant="ghost"
              className="w-full py-5 justify-center text-white hover:bg-indigo-650 hover:text-white border"
            >
              Logout
              <LogOut className="ml-2 size-6" />
            </Button>
          </div>
        </div>

        <div className="w-full px-4 mt-auto mb-5">
          <Popover
            open={isDesktopPopoverOpen}
            onOpenChange={setIsDesktopPopoverOpen}
          >
            <PopoverTrigger asChild>
              <div className="flex items-center justify-center gap-5 py-2 rounded-lg border cursor-pointer hover:bg-indigo-650 ">
                <span className="text-base font-medium text-white">
                  Jessica Smith
                </span>
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="https://s3-alpha-sig.figma.com/img/891f/f665/4cabb52b14cb062ef4178cdbf1e04781?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PzaRre0nkw1KM-inermkip96p4JVNIp5ZYtAAEuJiN7oh1xGxiFmWnvn6dCY7u9zk~SWSzVSlXv2R36ap0UAQcswVhtuQkv5nUkDP0yEsDcNA92S2cM-4Oe0uDehTPHhQulewiHGyC-CUmxmxTxdN0UF-y3FYRSctKF0g7dV6ITgUi16XNRQgPRmh0ucJzm0aRhy-RhCH2JUfO8Jz~oYDG9xXzFQogyuVkLLvjy57yQKU3AU5SCpAbKzlgsa77L7MpSkKmsQ2F211P26EcX5mCOAupawCudMgmK4U0H68CQAsG~U4palYQexLtmdYJ5MLjJBGC3iEfZi7zhOYSqBPw__" />
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-44 border border-white p-0 py-2 bg-inherit max-sm:hidden">
              <div className="flex flex-col items-center justify-center gap-2">
                <Link
                  href="/account"
                  onClick={() => setIsDesktopPopoverOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start text-white hover:bg-indigo-650 hover:text-white rounded-none"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Account Settings
                  </Button>
                </Link>
                <div className="border-b border-white w-full" />
                <Button
                  variant="ghost"
                  className="w-full flex justify-start text-white hover:bg-indigo-650 hover:text-white rounded-none"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}
