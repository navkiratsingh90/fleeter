"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, User, LayoutDashboard, BookOpen, Clock3, CheckCircle2, Users, ShieldCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";

type Role = "user" | "partner" | "admin";

type NavLinkItem = {
  label: string;
  href: string;
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user.role
  const navLinks: NavLinkItem[] = useMemo(() => {
    if (role === "partner") {
      return [
        { label: "Dashboard", href: "/partner/dashboard" },
        { label: "Bookings", href: "/partner/booking" },
        { label: "Pending Bookings", href: "/partner/pending-bookings" },
        { label: "Completed Bookings", href: "/partner/bookings/completed" },
      ];
    }

    if (role === "admin") {
      return [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Bookings", href: "/user/bookings" },
        { label: "Pending Bookings", href: "/admin/bookings/pending" },
        { label: "Users", href: "/admin/users" },
      ];
    }

    return [
      { label: "Home", href: "/" },
      { label: "Bookings", href: "/user/bookings" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ];
  }, [role]);

  const roleLabel =
    role === "partner" ? "Partner" : role === "admin" ? "Admin" : "User";

  const roleBadge =
    role === "partner"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : role === "admin"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : "bg-gray-50 text-gray-700 border-gray-100";
      const [pendingCount, setPendingCount] = useState(0);

      useEffect(() => {
        console.log(session);
        
        const fetchPendingCount = async () => {
          try {
            const { data } = await axios.get(
              "/api/partner/booking/pending-request-count"
            );   
            console.log(data);
            
            if (data.success) {
              setPendingCount(data.pendingCount);
            }
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchPendingCount();
      }, []);
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
            Fleeter 
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-dm text-sm font-medium transition-colors ${
                i === 0 ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              
                {link.label}
                {
                link.label == "Pending Bookings" && role == "partner" ? (
                  <span className="ml-2 rounded-full bg-[#22c55e] px-2 py-0.5 text-xs text-white">
                   {pendingCount}
                </span> 
                )
                : ""
              }
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {!session ? (
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full px-5">
                <Link href={"/signin"}>Sign In</Link>
              </Button>

              <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white px-5">
                <Link href={"/signup"}>Sign up</Link>
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

              <PopoverContent className="w-64 p-4" align="end">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user?.email}
                    </p>
                  </div>

                  <div
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${roleBadge}`}
                  >
                    {roleLabel}
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    {role === "partner" && (
                      <>
                        <Link href="/partner/dashboard" className="text-sm text-gray-700 hover:text-gray-900">
                          Dashboard
                        </Link>
                        <Link href="/partner/bookings" className="text-sm text-gray-700 hover:text-gray-900">
                          Bookings
                        </Link>
                        <Link href="/partner/pending-bookings">
                            Pending Bookings
                            {pendingCount > 0 && (
                              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {pendingCount}
                              </span>
                            )}
                          </Link>
                        <Link href="/partner/bookings/completed" className="text-sm text-gray-700 hover:text-gray-900">
                          Completed Bookings
                        </Link>
                      </>
                    )}

                    {role === "admin" && (
                      <>
                        <Link href="/admin/dashboard" className="text-sm text-gray-700 hover:text-gray-900">
                          Dashboard
                        </Link>
                        <Link href="/admin/bookings" className="text-sm text-gray-700 hover:text-gray-900">
                          Bookings
                        </Link>
                        <Link href="/admin/bookings/pending" className="text-sm text-gray-700 hover:text-gray-900">
                          Pending Bookings
                        </Link>
                        <Link href="/admin/users" className="text-sm text-gray-700 hover:text-gray-900">
                          Users
                        </Link>
                      </>
                    )}

                    {role === "user" && (
                      <>
                        <Link href="/user/bookings" className="text-sm text-gray-700 hover:text-gray-900">
                          Bookings
                        </Link>
                        <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">
                          Home
                        </Link>
                      </>
                    )}
                  </div>

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
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-dm text-sm text-gray-700 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-gray-100">
            {!session ? (
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="rounded-full w-full">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button className="rounded-full w-full bg-[#22c55e] hover:bg-[#16a34a] text-white">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${roleBadge}`}
                  >
                    {roleLabel}
                  </span>
                </div>

                {role === "partner" && (
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <Link href="/partner/dashboard" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/partner/bookings" onClick={() => setMobileOpen(false)}>
                      Bookings
                    </Link>
                    <Link href="/partner/bookings/pending" onClick={() => setMobileOpen(false)}>
                      Pending Bookings
                    </Link>
                    <Link href="/partner/bookings/completed" onClick={() => setMobileOpen(false)}>
                      Completed Bookings
                    </Link>
                  </div>
                )}

                {role === "admin" && (
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/admin/bookings" onClick={() => setMobileOpen(false)}>
                      Bookings
                    </Link>
                    <Link href="/partner/pending-bookings">
                    Pending Bookings
                    {pendingCount > 0 && (
                      <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                    <Link href="/admin/users" onClick={() => setMobileOpen(false)}>
                      Users
                    </Link>
                  </div>
                )}

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