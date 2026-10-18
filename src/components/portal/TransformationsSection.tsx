"use client";

import React, { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Modern 8-spoke asterisk icon matching the Dentis design system
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

// Interactive Before-After Slider Component
interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  altText: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  altText,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsInteracting(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isInteracting) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsInteracting(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-900 shadow-md touch-none group"
      role="slider"
      aria-valuenow={Math.round(sliderPos)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Perbandingan sebelum dan sesudah untuk ${altText}`}
    >
      {/* 1. After Image (Base background layer - visible on the right) */}
      <img
        src={afterImage}
        alt={`${altText} - Hasil Sesudah`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* 2. Before Image (Top layer - clipped to sliderPos on the left) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={`${altText} - Kondisi Sebelum`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* 3. Center Divider Line & Rounded Drag Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none -translate-x-1/2 flex items-center justify-center transition-all duration-75"
        style={{ left: `${sliderPos}%` }}
      >
        {/* Crisp vertical line */}
        <div className="w-[2.5px] h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

        {/* Center circular draggable button with < > arrows */}
        <div className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-xl border border-slate-200/90 flex items-center justify-center text-slate-800 pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform duration-150">
          <div className="flex items-center gap-0.5 text-slate-700">
            <ChevronLeft className="w-4 h-4 -mr-1.5 stroke-[2.5]" />
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* 4. Floating Badges: Before & After */}
      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-white/20 shadow-md">
          Before
        </span>
      </div>

      <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0D5966]/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-white/20 shadow-md">
          After
        </span>
      </div>

      {/* 5. Subtle interactive guidance pill */}
      <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] sm:text-xs font-medium border border-white/10 opacity-75 group-hover:opacity-100 transition-opacity">
          Geser untuk melihat perubahan
        </span>
      </div>
    </div>
  );
};

// Data 4 Kasus Transformasi Senyum sesuai spesifikasi
interface TransformationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

const TRANSFORMATION_CASES: TransformationCase[] = [
  {
    id: "case-01",
    caseNumber: "Kasus 01",
    title: "Pemutihan Gigi Laser (Laser Teeth Whitening)",
    description:
      "Mengangkat noda membandel kopi/teh dalam 1 sesi perawatan tanpa rasa ngilu.",
    beforeImage: "/assets/whitening-before.jpg",
    afterImage: "/assets/whitening-after.jpg",
  },
  {
    id: "case-02",
    caseNumber: "Kasus 02",
    title: "Clear Aligners (Behel Tak Kasat Mata)",
    description:
      "Menyelaraskan gigi depan berjejal dan meratakan gigitan dalam 6 bulan.",
    beforeImage: "/assets/aligner-before.jpg",
    afterImage: "/assets/aligner-after.jpg",
  },
  {
    id: "case-03",
    caseNumber: "Kasus 03",
    title: "Veneer Porselen Custom",
    description:
      "Merapikan bentuk, warna, dan celah gigi depan secara proporsional dan natural.",
    beforeImage: "/assets/veneer-before.jpg",
    afterImage: "/assets/veneer-after.jpg",
  },
  {
    id: "case-04",
    caseNumber: "Kasus 04",
    title: "Implan Gigi Tunggal",
    description:
      "Menggantikan gigi yang tanggal dengan akar titanium dan mahkota zirkonia yang kokoh.",
    beforeImage: "/assets/implant-before.jpg",
    afterImage: "/assets/implant-after.jpg",
  },
];

export const TransformationsSection: React.FC = () => {
  return (
    <section
      id="transformations"
      className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* 2-Kolom Bergaya Editorial Split-Sticky */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* ================= KOLOM KIRI (Sticky Sidebar - 5 kolom) ================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
          {/* Eyebrow Pill: Hasil Nyata dengan bintang berputar */}
          <div className="w-fit">
            <span className="group/badge inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0D5966]/10 hover:bg-[#0D5966]/15 text-[#0D5966] text-xs sm:text-sm font-semibold tracking-wide border border-[#0D5966]/15 shadow-xs transition-all cursor-pointer">
              <AsteriskIcon className="w-3.5 h-3.5 text-[#0D5966] transition-transform duration-700 ease-out group-hover/badge:rotate-[360deg] group-hover/badge:scale-110 hover:rotate-[360deg] animate-[spin_10s_linear_infinite]" />
              Hasil Nyata
            </span>
          </div>

          {/* Judul Display: Senyum Nyata, Hasil Nyata. */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight mt-4 sm:mt-5">
            Senyum Nyata, <br className="hidden sm:inline" />
            Hasil Nyata.
          </h2>
        </div>

        {/* ================= KOLOM KANAN: SATU CONTAINER HIJAU DENTIS MENYATU (#0D5966) MEMBUNGKUS SEMUA KARTU (KEK DI ABOUT US) ================= */}
        <div className="lg:col-span-7 bg-[#0D5966] p-3 sm:p-4 lg:p-5 rounded-[32px] sm:rounded-[36px] shadow-xl border border-[#0D5966]/20 flex flex-col gap-4 sm:gap-6 lg:gap-7">
          {TRANSFORMATION_CASES.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-[22px] sm:rounded-[26px] p-6 sm:p-8 flex flex-col border border-white/80 shadow-xs hover:shadow-md transition-all duration-300 group/card"
            >
              {/* Baris Atas: Badge model kek di service, tanpa pill & Ikon asterisk berputar halus saat hover */}
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D5966] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D5966]" />
                  {caseItem.caseNumber}
                </span>
                <AsteriskIcon className="w-5 h-5 text-slate-300 group-hover/card:text-[#0D5966] group-hover:text-[#0D5966] transition-transform duration-700 ease-out group-hover/card:rotate-[360deg] group-hover:rotate-[360deg] group-hover/card:scale-110 group-hover:scale-110 hover:rotate-[360deg] hover:scale-110 shrink-0" />
              </div>

              {/* Judul & Deskripsi Tindakan */}
              <h3 className="text-2xl font-bold text-slate-900 mt-3 mb-2 leading-snug group-hover/card:text-[#0D5966] transition-colors">
                {caseItem.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {caseItem.description}
              </p>

              {/* Area Foto Perbandingan (Interactive Before-After Canvas) */}
              <div className="mt-5">
                <BeforeAfterSlider
                  beforeImage={caseItem.beforeImage}
                  afterImage={caseItem.afterImage}
                  altText={caseItem.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
