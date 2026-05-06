import React from "react";

/* ─── Feature strip data ─────────────────────────────── */
const FEATURES = [
   { icon: "⚡", text: "Sub-second dispatch routing" },
   { icon: "🔒", text: "End-to-end trip encryption" },
   { icon: "📊", text: "Real-time vendor analytics" },
   { icon: "🌐", text: "Multi-city scalable infra" },
   { icon: "🤖", text: "AI-powered demand forecasting" },
] as const;

/* ─── Footer columns ─────────────────────────────────── */
const FOOTER_COLS = [
   {
      title: "Platform",
      links: ["Dispatch Engine", "Vendor Portal", "Analytics", "API Docs"],
   },
   {
      title: "Vehicles",
      links: ["Motorbike", "Economy", "Premium SUV", "Electric Bus"],
   },
   {
      title: "Company",
      links: ["About", "Careers", "Blog", "Contact"],
   },
] as const;

const Footer = () => {
   return (
      <>
         {/* ── Feature strip ── */}
         <section className="bg-[#0d0d0d] border-y border-white/[0.05] py-10 px-[60px] overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-5">
               {FEATURES.map(({ icon, text }) => (
                  <div
                     key={text}
                     className="flex items-center gap-2.5 font-dm text-[13px] font-medium text-white/40 whitespace-nowrap"
                  >
                     <span className="text-base">{icon}</span>
                     {text}
                  </div>
               ))}
            </div>
         </section>

         {/* ── Footer ── */}
         <footer className="bg-[#0a0a0a] border-t border-white/[0.05] pt-12 pb-10 px-[60px]">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-16">
               {/* Brand column */}
               <div>
                  <div className="flex items-center gap-2.5 mb-4">
                     <div className="size-8 bg-[#c4ff00] rounded-[7px] grid place-items-center shrink-0">
                        <svg
                           width="14"
                           height="14"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="#0a0a0a"
                           strokeWidth="2.5"
                        >
                           <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                     </div>
                     <span className="font-syne font-extrabold text-lg tracking-[-0.03em] text-white">
                        Fleeter
                     </span>
                  </div>
                  <p className="font-dm text-[13px] text-white/30 leading-relaxed max-w-[260px]">
                     The multi-vendor ride-sharing infrastructure powering the
                     next generation of urban mobility.
                  </p>
               </div>

               {/* Link columns */}
               {FOOTER_COLS.map((col) => (
                  <div key={col.title}>
                     <p className="font-dm text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 mb-4">
                        {col.title}
                     </p>
                     <div className="flex flex-col gap-2.5">
                        {col.links.map((link) => (
                           <a
                              key={link}
                              href="#"
                              className="font-dm text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200"
                           >
                              {link}
                           </a>
                        ))}
                     </div>
                  </div>
               ))}
            </div>

            {/* Bottom bar */}
            <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-white/[0.05] flex items-center justify-between flex-wrap gap-4">
               <span className="font-dm text-xs text-white/20">
                  © 2025 Veloce Technologies. All rights reserved.
               </span>
               <span className="font-dm text-xs text-white/20">
                  Privacy · Terms · Cookies
               </span>
            </div>
         </footer>
      </>
   );
};

export default Footer;
