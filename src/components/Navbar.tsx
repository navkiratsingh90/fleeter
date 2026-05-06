'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react';


const NAV_LINKS = ["Home", "About", "Services", "Vendors"] as const;


const Navbar = () => {
	const [mobileOpen, setMobileOpen] = useState(false);
	return (
		<>
    <section className="bg-white">
		<nav className="flex items-center justify-between px-8 md:px-16 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#22c55e] grid place-items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-syne font-bold text-[17px] text-gray-900 tracking-tight">
            Fleeter.
          </span>
        </div>

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

        <div className="hidden md:block">
          <Button className="bg-gray-900 text-white hover:bg-gray-700 rounded-full px-6 text-sm font-dm font-medium h-9">
            Login
          </Button>
        </div>

        <button className="md:hidden text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
			
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="font-dm text-sm text-gray-700 font-medium">{link}</a>
          ))}
          <Button className="bg-gray-900 text-white rounded-full px-6 w-fit text-sm font-medium">Login</Button>
        </div>
      )}
  </section>
		</>
	)
}

export default Navbar