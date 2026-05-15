"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // adjust import path to your shadcn setup

const NAV_LINKS = ["Home", "Bookings", "About Us", "Contact Us"] as const;

// Example user data – replace with your actual auth state
const demoUser = {
  name: "Alex Johnson",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="bg-white">
      <nav className="flex items-center justify-between px-8 md:px-16 py-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#22c55e] grid place-items-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-syne font-bold text-[17px] text-gray-900 tracking-tight">
            Fleeter.
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`font-dm text-sm font-medium transition-colors ${
                i === 0 ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Right Section: User Icon + Popover */}
        <div className="hidden md:flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-gray-700 hover:text-gray-900 transition-colors">
                <User size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-900">
                  {demoUser.name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  onClick={() => {
                    // Add your logout logic here
                    console.log("Logout clicked");
                  }}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="font-dm text-sm text-gray-700 font-medium"
            >
              {link}
            </a>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {demoUser.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => console.log("Logout from mobile")}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;