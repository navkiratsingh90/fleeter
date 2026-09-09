import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 px-6 md:px-10 py-5">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 bg-[#22c55e] rounded-[7px] grid place-items-center">
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

          <span className="font-syne font-extrabold text-lg tracking-[-0.03em] text-gray-900">
            Fleeter
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="font-dm text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            About
          </a>

          <a
            href="#"
            className="font-dm text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Contact
          </a>

          <a
            href="#"
            className="font-dm text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Privacy
          </a>

          <a
            href="#"
            className="font-dm text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Terms
          </a>
        </div>

        {/* Copyright */}
        <span className="font-dm text-xs text-gray-400">
          © 2025 Fleeter
        </span>
      </div>
    </footer>
  );
};

export default Footer;