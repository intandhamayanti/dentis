"use client";

import React, { useState } from "react";
import Image from "next/image";

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl =
    "https://wa.me/6282123456789?text=Halo%20dentis%2C%20saya%20ingin%20konsultasi%20mengenai%20jadwal%20dan%20perawatan%20gigi.";

  return (
    <aside
      aria-label="Kontak WhatsApp Dentis"
      className="fixed bottom-6 right-6 sm:bottom-7 sm:right-7 z-40 flex items-center group font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* Tooltip Pill / Chat Bubble */}
      <div
        className={`hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-800 py-2 px-3.5 rounded-full border border-slate-200/80 shadow-lg shadow-black/[0.08] mr-3 transition-all duration-300 pointer-events-none select-none ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-3 pointer-events-none"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="text-xs font-semibold text-slate-700 tracking-tight whitespace-nowrap">
          Konsultasi Gratis via WhatsApp
        </span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp untuk Konsultasi Gratis"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-14 h-14 sm:w-[58px] sm:h-[58px] rounded-full flex items-center justify-center transition-all duration-200 ease-out hover:scale-105 shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-900/35 cursor-pointer"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping opacity-75 pointer-events-none" />

        {/* Official WhatsApp Logo Icon */}
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src="/assets/whatsapp.png"
            alt="WhatsApp Chat Dentis"
            fill
            sizes="60px"
            className="object-cover select-none pointer-events-none"
            priority
          />
        </div>

        {/* Online Status Badge Indicator */}
        <span
          className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"
          title="Online"
        />
      </a>
    </aside>
  );
};
