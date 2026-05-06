"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Search, Menu, X } from "lucide-react";

const NAV_LINKS = ["Home", "About", "Services", "Vendors"] as const;

export default function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="min-h-screen bg-white flex flex-col font-dm overflow-hidden">

{/*      
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
      )} */}

      {/* ── Hero body ── */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row items-center px-8 md:px-16 pt-6 pb-0 gap-8 lg:gap-0 flex-1">

          {/* Left — Copy */}
          <div className="flex-1 max-w-[560px]">
            <span className="inline-block bg-[#f0fdf4] text-[#16a34a] text-xs font-semibold font-dm tracking-widest uppercase px-3 py-1.5 rounded-full mb-6 border border-[#bbf7d0]">
              Multi-Vendor Ride Sharing
            </span>

            <h1
              className="font-syne font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: "clamp(40px, 5vw, 68px)" }}
            >
              Book Your
              <br />
              Perfect{" "}
              <span className="text-[#22c55e]">Ride</span>
            </h1>

            <p className="font-dm text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[420px]">
              Choose from motorbikes, sedans, SUVs, autos and electric buses — all vendors, one platform. Fast, reliable and transparent pricing.
            </p>

            <div className="flex items-center gap-3">
              <Button className="bg-gray-900 hover:bg-gray-700 text-white font-dm font-semibold text-sm rounded-full px-7 py-3 h-auto">
                Discover Now
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 font-dm font-medium text-sm rounded-full px-7 py-3 h-auto"
              >
                View Vendors
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-6 mt-10 flex-wrap">
              <div className="flex -space-x-2">
                {(["#f97316","#22c55e","#3b82f6","#a855f7"] as const).map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white grid place-items-center text-white text-[10px] font-bold"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-syne font-bold text-gray-900 text-sm">4.2M+ Rides</p>
                <p className="font-dm text-xs text-gray-400">completed this month</p>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden sm:block" />
              <div className="hidden sm:block">
                <p className="font-syne font-bold text-gray-900 text-sm">200+ Vendors</p>
                <p className="font-dm text-xs text-gray-400">across the platform</p>
              </div>
            </div>
          </div>

          {/* Right — Illustration */}
          <div className="flex-1 flex justify-center items-end relative min-h-[320px] lg:min-h-0">

            {/* Floating map card */}
            <div className="absolute top-2 left-4 lg:left-8 bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-3 flex items-center gap-3 z-10">
              <div className="w-8 h-8 bg-[#f0fdf4] rounded-lg grid place-items-center">
                <MapPin size={14} className="text-[#22c55e]" />
              </div>
              <div>
                <p className="font-dm text-[10px] text-gray-400">Pickup point</p>
                <p className="font-syne font-bold text-[12px] text-gray-900">Sector 17, Chandigarh</p>
              </div>
            </div>

            {/* Floating driver card */}
            <div className="absolute top-16 right-2 lg:right-0 bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-3 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#22c55e] grid place-items-center text-white font-bold text-sm">R</div>
                <div>
                  <p className="font-syne font-bold text-[12px] text-gray-900">Rajveer S.</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-[11px]">★★★★★</span>
                    <span className="font-dm text-[10px] text-gray-400">4.9</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="font-dm text-[11px] text-gray-400">ETA</span>
                <span className="font-syne font-bold text-[12px] text-[#22c55e]">3 min away</span>
              </div>
            </div>

            {/* Main SVG Illustration */}
            <svg viewBox="0 0 480 400" width="480" height="400" fill="none" className="max-w-full">
              {/* Ground */}
              <ellipse cx="240" cy="372" rx="200" ry="16" fill="#f0fdf4"/>

              {/* Road */}
              <rect x="100" y="305" width="280" height="55" rx="8" fill="#f3f4f6"/>
              <rect x="140" y="329" width="28" height="6" rx="3" fill="#d1d5db"/>
              <rect x="200" y="329" width="28" height="6" rx="3" fill="#d1d5db"/>
              <rect x="260" y="329" width="28" height="6" rx="3" fill="#d1d5db"/>
              <rect x="320" y="329" width="28" height="6" rx="3" fill="#d1d5db"/>

              {/* Building 1 — left */}
              <rect x="72" y="162" width="64" height="152" rx="6" fill="#e2e8f0"/>
              <rect x="72" y="162" width="64" height="20" rx="6" fill="#cbd5e1"/>
              {[182,202,222,242,262,282].map((y,i)=>(
                <rect key={i} x={84} y={y} width="12" height="10" rx="2" fill={i%3===0?"#fde68a":"#bfdbfe"}/>
              ))}
              {[182,202,222,242,262,282].map((y,i)=>(
                <rect key={i} x={104} y={y} width="12" height="10" rx="2" fill={i%2===0?"#93c5fd":"#dbeafe"}/>
              ))}
              {[182,202,222,242,262,282].map((y,i)=>(
                <rect key={i} x={124} y={y} width="12" height="10" rx="2" fill={i%4===0?"#fbbf24":"#e2e8f0"}/>
              ))}

              {/* Building 2 — center */}
              <rect x="186" y="215" width="88" height="98" rx="6" fill="#dbeafe"/>
              <rect x="186" y="215" width="88" height="18" rx="6" fill="#bfdbfe"/>
              {[235,255,275].map((y,i)=>[198,218,238,254].map((x,j)=>(
                <rect key={`${i}${j}`} x={x} y={y} width="12" height="12" rx="2" fill={i===1&&j===2?"#fde68a":i===0&&j===0?"#a5f3fc":"#bfdbfe"}/>
              )))}

              {/* Building 3 — right */}
              <rect x="316" y="188" width="72" height="126" rx="6" fill="#ede9fe"/>
              <rect x="316" y="188" width="72" height="18" rx="6" fill="#ddd6fe"/>
              {[208,228,248,268,288].map((y,i)=>(
                <rect key={i} x={330} y={y} width="10" height="10" rx="2" fill={i%2===0?"#a78bfa":"#ddd6fe"}/>
              ))}
              {[208,228,248,268,288].map((y,i)=>(
                <rect key={i} x={350} y={y} width="10" height="10" rx="2" fill={i%3===0?"#fbbf24":"#ede9fe"}/>
              ))}
              {[208,228,248,268,288].map((y,i)=>(
                <rect key={i} x={370} y={y} width="10" height="10" rx="2" fill={i%2===1?"#c4b5fd":"#ede9fe"}/>
              ))}

              {/* Car — green */}
              <rect x="162" y="310" width="72" height="28" rx="7" fill="#22c55e"/>
              <path d="M175 310 L184 296 L214 296 L222 310Z" fill="#16a34a"/>
              <rect x="186" y="299" width="24" height="11" rx="3" fill="#bbf7d0"/>
              <circle cx="180" cy="338" r="8" fill="#1f2937"/>
              <circle cx="180" cy="338" r="3.5" fill="#4b5563"/>
              <circle cx="216" cy="338" r="8" fill="#1f2937"/>
              <circle cx="216" cy="338" r="3.5" fill="#4b5563"/>

              {/* Motorbike — orange */}
              <ellipse cx="298" cy="337" rx="9" ry="9" stroke="#f97316" strokeWidth="3"/>
              <ellipse cx="298" cy="337" rx="4" ry="4" fill="#fed7aa"/>
              <ellipse cx="324" cy="337" rx="9" ry="9" stroke="#f97316" strokeWidth="3"/>
              <ellipse cx="324" cy="337" rx="4" ry="4" fill="#fed7aa"/>
              <path d="M298 328 L308 328 L318 315 L326 315 L332 328" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="322" y="310" width="14" height="7" rx="2" stroke="#f97316" strokeWidth="2"/>

              {/* Map pin */}
              <path d="M240 168 C240 148 220 138 220 158 C220 174 240 188 240 188 C240 188 260 174 260 158 C260 138 240 148 240 168Z" fill="#22c55e"/>
              <circle cx="240" cy="160" r="6" fill="white"/>

              {/* Dashed route */}
              <path d="M207 332 Q222 265 240 184" stroke="#22c55e" strokeWidth="2" strokeDasharray="5 4" opacity="0.45"/>

              {/* Decorative elements */}
              <circle cx="388" cy="145" r="7" fill="#fbbf24"/>
              <circle cx="68" cy="125" r="5" fill="#a78bfa"/>
              <circle cx="420" cy="262" r="5" fill="#22c55e" opacity="0.4"/>
              <path d="M52 200 L58 194 L64 200" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
              <path d="M400 180 L406 174 L412 180" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* ── Search bar strip ── */}
        <div className="bg-[#f0fdf4] px-8 md:px-16 py-6 mt-4 lg:mt-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-100 max-w-[900px]">

            <div className="flex items-center gap-3 px-5 py-4 flex-1">
              <div className="w-9 h-9 rounded-xl bg-[#f0fdf4] grid place-items-center shrink-0">
                <MapPin size={15} className="text-[#22c55e]" />
              </div>
              <div>
                <p className="font-dm text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Location</p>
                <p className="font-syne font-bold text-sm text-gray-900">Where are you going?</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 flex-1">
              <div className="w-9 h-9 rounded-xl bg-[#fffbeb] grid place-items-center shrink-0">
                <Calendar size={15} className="text-[#f59e0b]" />
              </div>
              <div>
                <p className="font-dm text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                <p className="font-syne font-bold text-sm text-gray-900">When will you travel?</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 flex-1">
              <div className="w-9 h-9 rounded-xl bg-[#faf5ff] grid place-items-center shrink-0">
                <Users size={15} className="text-[#a855f7]" />
              </div>
              <div>
                <p className="font-dm text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">People</p>
                <p className="font-syne font-bold text-sm text-gray-900">How many people?</p>
              </div>
            </div>

            <div className="flex items-center px-4 py-3 shrink-0">
              <Button className="w-full md:w-auto bg-gray-900 hover:bg-gray-700 text-white rounded-xl px-5 h-11 gap-2 font-dm font-semibold text-sm">
                <Search size={15} />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}