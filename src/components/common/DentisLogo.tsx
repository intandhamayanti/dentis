"use client";

import React from "react";
import Image from "next/image";

interface DentisLogoProps {
  className?: string;
  variant?: "light" | "dark" | "default";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export const DentisLogo: React.FC<DentisLogoProps> = ({
  className = "",
  variant = "default",
  size = "md",
  showTagline = false,
}) => {
  const iconDimensions = {
    sm: { width: 26, height: 26, className: "w-6 h-6" },
    md: { width: 34, height: 34, className: "w-8.5 h-8.5" },
    lg: { width: 44, height: 44, className: "w-11 h-11" },
    xl: { width: 56, height: 56, className: "w-14 h-14" },
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const isLight = variant === "light";
  const dim = iconDimensions[size];
  const logoSrc = isLight
    ? "/assets/logo-white-original.png"
    : "/assets/logo-teal-original.png";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Original Authentic Tooth Logo Asset */}
      <div
        className={`relative ${dim.className} flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0`}
      >
        <Image
          src={logoSrc}
          alt="Dentis official logo"
          width={dim.width}
          height={dim.height}
          priority
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>

      <div className="flex flex-col">
        <div
          className={`font-bold tracking-tight leading-none ${textSizes[size]} ${
            isLight ? "text-white" : "text-[#0D5966]"
          }`}
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
        >
          <span>Dentis</span>
        </div>
        {showTagline && (
          <span
            className={`text-[9px] tracking-widest font-semibold uppercase mt-0.5 ${
              isLight ? "text-white/80" : "text-[#64748B]"
            }`}
          >
            Dental Care & Aesthetics
          </span>
        )}
      </div>
    </div>
  );
};
