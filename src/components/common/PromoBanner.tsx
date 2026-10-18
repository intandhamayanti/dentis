"use client";

import React, { useState } from "react";
import { useDentalStore } from "@/context/DentalContext";
import { Sparkles, X, ArrowUpRight } from "lucide-react";

export const PromoBanner: React.FC = () => {
  const { cmsConfig, openBookingModal } = useDentalStore();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!cmsConfig.showAnnouncement || isDismissed) {
    return null;
  }

  return (
    <div className="bg-[#0D5966] text-white px-4 py-2.5 text-xs sm:text-sm font-medium border-b border-white/10 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 bg-white text-[#0D5966] font-bold text-[11px] px-2.5 py-0.5 rounded-full shrink-0 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#0D5966]" />
            {cmsConfig.announcementBadge}
          </span>
          <p className="truncate text-white/95">
            {cmsConfig.announcementText}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openBookingModal()}
            className="hidden sm:inline-flex items-center gap-1 text-white hover:text-white/80 font-bold text-xs tracking-wide transition-colors cursor-pointer group underline underline-offset-2"
          >
            <span>Klaim Diskon {cmsConfig.promoDiscountPercent}%</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
            aria-label="Tutup Banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
