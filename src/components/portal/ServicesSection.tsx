"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { scrollToBookingForm } from "../../lib/navigation";

// 8-spoke asterisk icon matching the About Us section DNA
const AsteriskIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
  </svg>
);

interface ServiceCardData {
  id: string;
  category: string;
  title: string;
  description: string;
  checklist: string[];
  ctaLabel: string;
  imageSrc: string;
  imageAlt: string;
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    id: "general-dentistry",
    category: "Perawatan Rutin",
    title: "Perawatan Gigi Umum",
    description:
      "Perawatan preventif komprehensif dan pembersihan karang gigi untuk menjaga kesehatan gigi serta gusi bebas rasa ngilu.",
    checklist: [
      "Pemeriksaan Gigi & Rontgen Digital",
      "Scaling Karang Gigi Ultrasonik",
      "Tambal Estetis Sesuai Warna Gigi",
      "Terapi Perawatan Gusi & Sensitif",
    ],
    ctaLabel: "Booking Konsultasi",
    imageSrc: "/assets/service-general-care.jpg",
    imageAlt: "Dokter gigi spesialis Dentis melakukan konsultasi perawatan rutin dengan model anatomi gigi",
  },
  {
    id: "cosmetic-dentistry",
    category: "Smile Design",
    title: "Kedokteran Gigi Estetika",
    description:
      "Sempurnakan keindahan senyum alami Anda melalui perawatan estetika modern yang dirancang presisi sesuai proporsi wajah.",
    checklist: [
      "Laser Teeth Whitening Bebas Ngilu",
      "Veneer Porselen Kustom Presisi",
      "Invisalign & Clear Aligners",
      "Aesthetic Composite Bonding",
    ],
    ctaLabel: "Booking Konsultasi",
    imageSrc: "/assets/service-aesthetic-smile.jpg",
    imageAlt: "Pasien tersenyum bahagia melihat hasil perawatan estetika gigi di cermin",
  },
  {
    id: "restorative-dentistry",
    category: "Bedah & Implan",
    title: "Restorasi & Bedah Mulut",
    description:
      "Pulihkan fungsi kunyah optimal dan struktur anatomi gigi menggunakan material biokompatibel serta implan presisi tinggi.",
    checklist: [
      "Implan Gigi Tunggal & Full-Arch",
      "Mahkota & Jembatan Keramik Zirconia",
      "Perawatan Saluran Akar Bebas Nyeri",
      "Pencabutan Gigi Bungsu Minimal Invasif",
    ],
    ctaLabel: "Booking Konsultasi",
    imageSrc: "/assets/service-restorative-implants.jpg",
    imageAlt: "Dokter spesialis bedah dan implan menjelaskan hasil scan digital 3D kepada pasien",
  },
  {
    id: "pediatric-dentistry",
    category: "Anak & Remaja",
    title: "Gigi Anak & Keluarga",
    description:
      "Pengalaman ke dokter gigi yang hangat, ramah, dan bebas cemas yang dirancang khusus untuk kenyamanan buah hati dan keluarga.",
    checklist: [
      "Pemeriksaan Anak Ramah & Bebas Takut",
      "Aplikasi Fluoride Perlindungan Enamel",
      "Dental Fissure Sealant Anti Lubang",
      "Evaluasi Dini Pertumbuhan Rahang",
    ],
    ctaLabel: "Booking Konsultasi",
    imageSrc: "/assets/service-pediatric-family.jpg",
    imageAlt: "Dokter gigi anak yang ramah mengedukasi cara menyikat gigi yang menyenangkan bersama pasien cilik",
  },
];

export const ServicesSection: React.FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [imageParallaxList, setImageParallaxList] = useState<number[]>(
    SERVICES_DATA.map(() => 0)
  );
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Smooth scroll listener for inner image parallax (card does NOT scale down)
  useEffect(() => {
    if (!isDesktop) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const vh = window.innerHeight;

        const updatedParallax = SERVICES_DATA.map((_, idx) => {
          const currentCard = cardRefs.current[idx];
          if (!currentCard) return 0;

          const currentRect = currentCard.getBoundingClientRect();
          const cardHeight = currentRect.height || 480;

          // Inner image parallax shift based on viewport position
          const cardCenter = currentRect.top + cardHeight / 2;
          const viewportCenter = vh / 2;
          const rawParallax = (cardCenter - viewportCenter) * 0.08;
          return Math.max(-28, Math.min(28, rawParallax));
        });

        setImageParallaxList(updatedParallax);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop]);

  return (
    <section
      id="services"
      className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* 1. SECTION HEADER (Centered atas-bawah layout, headline strictly 2 lines) */}
      <div className="mb-12 sm:mb-16 text-center max-w-5xl mx-auto flex flex-col items-center">
        {/* Badge Layanan Kami (Atas, Center) */}
        <div className="mb-3.5 sm:mb-4">
          <span className="group/badge inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0D5966]/10 hover:bg-[#0D5966]/15 text-[#0D5966] text-xs sm:text-sm font-semibold tracking-wide border border-[#0D5966]/15 shadow-xs transition-all cursor-pointer">
            <AsteriskIcon className="w-3.5 h-3.5 text-[#0D5966] transition-transform duration-700 ease-out group-hover/badge:rotate-[360deg] group-hover/badge:scale-110 hover:rotate-[360deg] animate-[spin_10s_linear_infinite]" />
            Layanan Kami
          </span>
        </div>

        {/* Headline / Judul Utama */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight text-center max-w-2xl mx-auto">
          Perawatan Lengkap untuk<br />Senyum Percaya Diri
        </h2>
      </div>

      {/* 2. STICKY STACKING CARDS (No scale down on underlying card, no hover effect on photo) */}
      <div className="relative flex flex-col gap-8 lg:gap-0">
        {SERVICES_DATA.map((service, idx) => {
          const isEven = idx % 2 === 0;
          const parallaxY = isDesktop ? imageParallaxList[idx] || 0 : 0;

          return (
            <div
              key={service.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className={`w-full transition-all duration-200 ${
                isDesktop
                  ? "lg:sticky lg:top-28 lg:mb-28"
                  : "relative"
              }`}
              style={{
                zIndex: (idx + 1) * 10,
              }}
            >
              {/* Outer Card Wrapper: Wrapped in Dentis Deep Teal #0D5966 (DNA identical to About Us) */}
              <div
                className="bg-[#0D5966] p-3 sm:p-3.5 lg:p-4 rounded-[28px] sm:rounded-[34px] lg:rounded-[38px] shadow-md border border-[#0D5966]/15 transition-all duration-300 relative overflow-hidden"
                style={{
                  boxShadow:
                    idx > 0 && isDesktop
                      ? "0 10px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04)"
                      : "0 6px 16px -4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* 2 Inner Containers: Container Foto & Container Penjelasan */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 items-stretch relative z-10">
                  
                  {/* Inner Container 1: Foto (No hover scale, no badge overlay) */}
                  <div
                    className={`lg:col-span-6 w-full ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full min-h-[260px] sm:min-h-[300px] lg:min-h-[380px] bg-slate-900 shadow-xs border border-white/10">
                      {/* Inner Parallax Image (Without hover zoom) */}
                      <div
                        className="w-full h-full relative transition-transform duration-100 ease-out will-change-transform"
                        style={{
                          transform: isDesktop
                            ? `translateY(${parallaxY}px) scale(1.12)`
                            : "scale(1.02)",
                        }}
                      >
                        <Image
                          src={service.imageSrc}
                          alt={service.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover object-center select-none"
                          priority={idx === 0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inner Container 2: Penjelasan Service (White card body matching About Us stats DNA) */}
                  <div
                    className={`lg:col-span-6 rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] bg-white p-6 sm:p-8 lg:p-9 flex flex-col justify-between shadow-xs border border-slate-100 group/card group ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div>
                      {/* Category Pill & Rotating Asterisk matching About Us */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#0D5966] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0D5966]" />
                          {service.category}
                        </span>

                        <AsteriskIcon className="w-5 h-5 text-slate-300 group-hover/card:text-[#0D5966] group-hover:text-[#0D5966] transition-transform duration-700 ease-out group-hover/card:rotate-[360deg] group-hover:rotate-[360deg] group-hover/card:scale-110 group-hover:scale-110 hover:rotate-[360deg] hover:scale-110 shrink-0" />
                      </div>

                      {/* Card Title */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug group-hover/card:text-[#0D5966] transition-colors">
                        {service.title}
                      </h3>

                      {/* Card Description (Concise & airy) */}
                      <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mt-2.5">
                        {service.description}
                      </p>

                      {/* Checklist: Numbered pill points (01, 02, 03, 04) replacing asterisk icons */}
                      <ul className="space-y-2.5 my-5 sm:my-6">
                        {service.checklist.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-snug"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#0D5966]/10 text-[#0D5966] text-[10px] font-bold font-mono flex items-center justify-center shrink-0 border border-[#0D5966]/15">
                              {String(itemIdx + 1).padStart(2, "0")}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Action: CTA Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-start mt-auto">
                      <button
                        type="button"
                        onClick={() => scrollToBookingForm(service.category)}
                        className="inline-flex items-center gap-2 bg-[#0D5966] hover:bg-[#09414B] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group/btn"
                      >
                        <span>{service.ctaLabel}</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 shrink-0" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
