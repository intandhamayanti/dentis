"use client";

import React, { useState, useEffect } from "react";
import { DentisLogo } from "./DentisLogo";
import { useDentalStore } from "@/context/DentalContext";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { openBookingModal } = useDentalStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(currentScroll > 15);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-3 sm:top-4 left-0 right-0 z-50 transition-all duration-300 ease-out flex justify-center px-4 ${
        isScrolled
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-8 pointer-events-none"
      }`}
    >
      {/* Floating Glassmorphism Pill (Hanya muncul saat di-scroll) */}
      <div className="w-full max-w-4xl bg-white/85 backdrop-blur-2xl rounded-full border border-white/60 shadow-2xl px-5 sm:px-7 py-2.5 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Asli "dentis." */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer group flex items-center shrink-0"
          >
            <DentisLogo variant="default" size={isScrolled ? "sm" : "md"} />
          </div>

          {/* Menu Navigasi Sesuai Instruksi Pengguna (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-normal text-[#64748B]">
            <button
              onClick={() => scrollTo("services")}
              className="px-3.5 py-1.5 rounded-full hover:text-[#0D5966] hover:bg-[#F3F5F4] transition-colors cursor-pointer"
            >
              Treatments
            </button>
            <button
              onClick={() => scrollTo("doctors")}
              className="px-3.5 py-1.5 rounded-full hover:text-[#0D5966] hover:bg-[#F3F5F4] transition-colors cursor-pointer"
            >
              Specialists
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="px-3.5 py-1.5 rounded-full hover:text-[#0D5966] hover:bg-[#F3F5F4] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollTo("reviews")}
              className="px-3.5 py-1.5 rounded-full hover:text-[#0D5966] hover:bg-[#F3F5F4] transition-colors cursor-pointer"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-3.5 py-1.5 rounded-full hover:text-[#0D5966] hover:bg-[#F3F5F4] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Tombol Aksi: Konsisten dengan gaya pill modern */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => openBookingModal()}
              className="hidden sm:inline-flex items-center gap-2 bg-[#0D5966] hover:bg-[#083c45] text-white font-normal px-5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer text-xs sm:text-sm tracking-tight group"
            >
              <span>Buat Janji Temu</span>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3 h-3 text-white" />
              </span>
            </button>

            {/* Tombol Mobile */}
            <button
              onClick={() => openBookingModal()}
              className="sm:hidden inline-flex items-center gap-1.5 bg-[#0D5966] text-white font-normal px-3.5 py-1.5 rounded-full text-xs shadow-xs"
            >
              <span>Reservasi</span>
              <ArrowUpRight className="w-3 h-3 text-white" />
            </button>

            {/* Toggle Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-[#0F172A] hover:bg-[#F3F5F4] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#0D5966]" />
              ) : (
                <Menu className="w-5 h-5 text-[#0D5966]" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#E2E8F0] pb-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-0.5 text-sm font-normal text-[#0F172A]">
              <button
                onClick={() => scrollTo("services")}
                className="text-left px-3 py-2 rounded-xl hover:bg-[#F3F5F4] hover:text-[#0D5966]"
              >
                Treatments (Layanan)
              </button>
              <button
                onClick={() => scrollTo("doctors")}
                className="text-left px-3 py-2 rounded-xl hover:bg-[#F3F5F4] hover:text-[#0D5966]"
              >
                Specialists (Dokter Gigi)
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="text-left px-3 py-2 rounded-xl hover:bg-[#F3F5F4] hover:text-[#0D5966]"
              >
                About (Video 3D Transformasi)
              </button>
              <button
                onClick={() => scrollTo("reviews")}
                className="text-left px-3 py-2 rounded-xl hover:bg-[#F3F5F4] hover:text-[#0D5966]"
              >
                Reviews (Testimoni Pasien)
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="text-left px-3 py-2 rounded-xl hover:bg-[#F3F5F4] hover:text-[#0D5966]"
              >
                Contact (Lokasi & Jam Buka)
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
