"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToBookingForm } from "../../lib/navigation";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Treatments", target: "services" },
    { label: "Transformations", target: "transformations" },
    { label: "Specialists", target: "doctors" },
    { label: "Reviews", target: "reviews" },
    { label: "FAQ", target: "faq" },
  ];

  return (
    <>
      {/* Persistent Outer Wrapper */}
      <div className="fixed top-0 inset-x-0 z-40 pointer-events-none px-3 sm:px-6 transition-all duration-500 font-['Bricolage_Grotesque',sans-serif]">
        <header
          className={`mx-auto pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "max-w-5xl mt-3 sm:mt-4 px-4 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_14px_35px_-8px_rgba(13,89,102,0.12)]"
              : "max-w-7xl px-3 sm:px-6 py-4 sm:py-7 bg-transparent border-transparent"
          }`}
        >
          {/* KIRI: Logo Mark dentis + Teks dentis. */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 select-none"
          >
            <div className="relative w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/logo-teal-original.png"
                alt="dentis. logo"
                width={34}
                height={34}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900 group-hover:text-[#0D5966] transition-colors">
              dentis<span className="text-[#0D5966]">.</span>
            </span>
          </div>

          {/* TENGAH: Menu Horizontal (Desktop Only) */}
          <nav
            className={`hidden md:flex items-center font-medium text-slate-600 transition-all ${
              isScrolled ? "gap-6 lg:gap-8 text-sm" : "gap-7 lg:gap-10 text-[15px]"
            }`}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.target)}
                className="hover:text-[#0D5966] transition-colors cursor-pointer select-none py-1 relative group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0D5966] transition-all duration-200 group-hover:w-full rounded-full" />
              </button>
            ))}
          </nav>

          {/* KANAN: Di Mobile CUKUP BURGER MENU SAJA, Di Desktop Tombol Booking */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Tombol Booking Sekarang: HANYA TAMPIL DI DESKTOP */}
            <button
              onClick={() => scrollToBookingForm()}
              className={`hidden md:inline-flex group items-center gap-2 bg-[#0D5966] hover:bg-[#09414B] text-white font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer select-none ${
                isScrolled
                  ? "text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5"
                  : "text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3"
              }`}
            >
              <span>Booking Sekarang</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </button>

            {/* Mobile Hamburger Toggle: Bersih, Rapi & Elegan */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 hover:text-[#0D5966] hover:border-[#0D5966]/40 shadow-xs transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Tutup Navigasi" : "Buka Navigasi"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </header>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE MENU BESPOKE & EDITORIAL (Bebas dari AI-Slop & Bersih)             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-fullscreen"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#FBFDFD] flex flex-col justify-between p-6 sm:p-8 md:hidden font-['Bricolage_Grotesque',sans-serif] overflow-y-auto select-none"
          >
            {/* Top Bar: Logo & Close Button */}
            <div className="flex items-center justify-between shrink-0 pb-2">
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/assets/logo-teal-original.png"
                    alt="dentis. logo"
                    width={34}
                    height={34}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">
                  dentis<span className="text-[#0D5966]">.</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup Navigasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links: Editorial, confident, spacious typography */}
            <nav className="flex flex-col justify-center my-auto py-8 divide-y divide-slate-100">
              {navLinks.map((link, idx) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.target)}
                  className="group flex items-baseline justify-between py-4 text-left cursor-pointer transition-colors"
                >
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 group-hover:text-[#0D5966] transition-colors">
                    {link.label}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400 group-hover:text-[#0D5966] transition-colors">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </nav>

            {/* Bottom Actions: Full-width button and clinic detail */}
            <div className="pt-6 shrink-0 space-y-3.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToBookingForm();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-[#0D5966] hover:bg-[#09414B] text-white font-bold text-sm sm:text-base tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 group"
              >
                <span>Reservasi Konsultasi</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
                <span>Senopati, Jakarta Selatan</span>
                <a
                  href="https://wa.me/6282123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0D5966] transition-colors"
                >
                  WhatsApp: +62 821 2345 6789
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
