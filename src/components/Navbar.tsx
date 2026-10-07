"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  BookOpen,
  Clock3,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";

type Role = "user" | "partner" | "admin";

type NavLinkItem = {
  label: string;
  href: string;
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const { data: session } = useSession();

  const role = session?.user?.role as Role | undefined;

  const navLinks: NavLinkItem[] = useMemo(() => {
    // PARTNER
    if (role === "partner") {
      return [
        {
          label: "Dashboard",
          href: "/",
        },
        {
          label: "Pending Bookings",
          href: "/partner/pending-bookings",
        },
        {
          label : "Bookings",
          href : "/partner/bookings"
        }
      ];
    }

    // ADMIN
    if (role === "admin") {
      return [
        {
          label: "Admin Dashboard",
          href: "/",
        },

        {
          label: "Book & Track Ride",
          href: "/user/book",
        },
      ];
    }

    // NORMAL USER
    return [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Become a Partner",
        href: "/partner/onboarding/vehicle",
      },
      {
        label: "Book & Track Ride",
        href: "/user/book",
      },
    ];
  }, [role]);

  /*
   * Fetch pending bookings count only for PARTNER
   */
  useEffect(() => {
    if (role !== "partner") {
      setPendingCount(0);
      return;
    }

    const fetchPendingCount = async () => {
      try {
        const { data } = await axios.get(
          "/api/partner/booking/pending-request-count"
        );

        if (data.success) {
          setPendingCount(data.pendingCount || 0);
        }
      } catch (error) {
        console.error(
          "Failed to fetch pending booking count:",
          error
        );
      }
    };

    fetchPendingCount();

    // Optional: refresh count every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, [role]);

  const roleLabel =
    role === "partner"
      ? "Partner"
      : role === "admin"
      ? "Admin"
      : "User";

  const roleBadge =
    role === "partner"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : role === "admin"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <section className="bg-white">
      <nav className="flex items-center justify-between px-8 md:px-16 py-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
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
            Fleeter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-dm text-sm font-medium transition-colors flex items-center ${
                i === 0
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {link.label}

              {/* Partner Pending Count */}
              {/* {link.label === "Pending Bookings" &&
                role === "partner" && (
                  <span className="ml-2 rounded-full bg-[#22c55e] px-2 py-0.5 text-xs text-white min-w-[20px] text-center">
                    {pendingCount}
                  </span>
                )} */}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {!session ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-full text-black px-5"
              >
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>

              <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white px-5">
                <Link href="/signup">
                  Sign up
                </Link>
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                  <User size={20} />

                  <span className="hidden lg:inline text-sm font-medium">
                    {session.user?.name}
                  </span>
                </button>
              </PopoverTrigger>

              <PopoverContent
                className="w-64 p-4"
                align="end"
              >
                <div className="flex flex-col gap-3">
                  {/* User Info */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {session.user?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {session.user?.email}
                    </p>
                  </div>

                  {/* Role */}
                  <div
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${roleBadge}`}
                  >
                    {roleLabel}
                  </div>

                  {/* Role Based Links */}
                  <div className="flex flex-col gap-3 pt-1">
                    {/* PARTNER */}
                    {role === "partner" && (
                      <>
                        <Link
                          href="/"
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>

                        <Link
                          href="/partner/pending-bookings"
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          <Clock3 size={16} />
                          Pending Bookings

                        </Link>
                      </>
                    )}

                    {/* ADMIN */}
                    {role === "admin" && (
                      <>
                        <Link
                          href="/"
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          <LayoutDashboard size={16} />
                          Admin Dashboard
                        </Link>

                        <Link
                          href="/user/book"
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          <BookOpen size={16} />
                          Book & Track Ride
                        </Link>
                      </>
                    )}

                    {/* NORMAL USER */}
                    {role === "user" && (
                      <Link
                        href="/user/book"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                      >
                        <BookOpen size={16} />
                        Book & Track Ride
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-4">
          {/* Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-dm text-sm text-gray-700 font-medium flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}

             
            </Link>
          ))}

          {/* Mobile User Section */}
          <div className="pt-2 border-t border-gray-100">
            {!session ? (
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="rounded-full text-black w-full"
                >
                  <Link href="/signin">
                    Sign In
                  </Link>
                </Button>

                <Button className="rounded-full w-full bg-[#22c55e] hover:bg-[#16a34a] text-white">
                  <Link href="/signup">
                    Sign up
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {session.user?.email}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${roleBadge}`}
                  >
                    {roleLabel}
                  </span>
                </div>

                {/* PARTNER */}
                {role === "partner" && (
                  <div className="flex flex-col gap-3 text-sm text-gray-700">
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <Link
                      href="/partner/pending-bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <Clock3 size={16} />
                      Pending Bookings
                    </Link>
                  </div>
                )}

                {/* ADMIN */}
                {role === "admin" && (
                  <div className="flex flex-col gap-3 text-sm text-gray-700">
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Link>

                    <Link
                      href="/user/bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <BookOpen size={16} />
                      Book & Track Ride
                    </Link>
                  </div>
                )}

                {/* NORMAL USER */}
                {role === "user" && (
                  <div className="flex flex-col gap-3 text-sm text-gray-700">
                    <Link
                      href="/user/bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <BookOpen size={16} />
                      Book & Track Ride
                    </Link>
                  </div>
                )}

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 justify-start px-0"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;