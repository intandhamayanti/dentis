"use client";

import React from "react";
import { useDentalStore } from "@/context/DentalContext";

// 8-spoke asterisk icon matching the Dentis design system
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

interface SpecialistDoctor {
  id: string;
  name: string;
  specialization: string;
  image: string;
}

const SPECIALIST_DOCTORS: SpecialistDoctor[] = [
  {
    id: "doc-dimas",
    name: "drg. Dimas Wicaksono, Sp.BMM",
    specialization: "Spesialis Bedah Mulut & Implan",
    image: "/assets/doctors/drg-dimas.jpg",
  },
  {
    id: "doc-nabila",
    name: "drg. Nabila Putri, Sp.KG",
    specialization: "Spesialis Konservasi Gigi & Estetika",
    image: "/assets/doctors/drg-nabila.jpg",
  },
  {
    id: "doc-arya",
    name: "drg. Arya Pratama, Sp.Ort",
    specialization: "Spesialis Ortodonsia & Aligner",
    image: "/assets/doctors/drg-arya.jpg",
  },
  {
    id: "doc-siti",
    name: "drg. Siti Rahmawati, Sp.KGA",
    specialization: "Spesialis Kedokteran Gigi Anak",
    image: "/assets/doctors/drg-siti.jpg",
  },
  {
    id: "doc-kevin",
    name: "drg. Kevin Sanjaya, Sp.Pros",
    specialization: "Spesialis Prostodonsia & Veneer",
    image: "/assets/doctors/drg-kevin.jpg",
  },
  {
    id: "doc-amanda",
    name: "drg. Amanda Lestari, Sp.Perio",
    specialization: "Spesialis Periodonsia & Gusi",
    image: "/assets/doctors/drg-amanda.jpg",
  },
  {
    id: "doc-clarissa",
    name: "drg. Clarissa Maharani, Sp.KGA",
    specialization: "Spesialis Gigi Anak & Preventif",
    image: "/assets/doctors/drg-clarissa.jpg",
  },
];

export const DoctorsSection: React.FC = () => {
  const { openBookingModal } = useDentalStore();

  // Duplicate array 2x for a completely seamless, infinite marquee loop
  const marqueeList = [
    ...SPECIALIST_DOCTORS,
    ...SPECIALIST_DOCTORS,
  ];

  return (
    <section
      id="doctors"
      className="scroll-mt-28 py-16 sm:py-20 lg:py-24 overflow-hidden font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* Scoped Keyframes & GPU-Accelerated Infinite Marquee with Native Pause-on-Hover */}
      <style>{`
        @keyframes doctorMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .doctor-marquee-track {
          display: flex;
          flex-direction: row;
          flex-nowrap: nowrap;
          width: max-content;
          animation: doctorMarquee 42s linear infinite;
          will-change: transform;
        }
        .doctor-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* 1. SECTION HEADER (Consistent with Dentis design system) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 text-center max-w-4xl flex flex-col items-center">
        {/* Eyebrow Badge Pill */}
        <div className="mb-3.5 sm:mb-4">
          <span className="group/badge inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0D5966]/10 hover:bg-[#0D5966]/15 text-[#0D5966] text-xs sm:text-sm font-semibold tracking-wide border border-[#0D5966]/15 shadow-xs transition-all cursor-pointer">
            <AsteriskIcon className="w-3.5 h-3.5 text-[#0D5966] transition-transform duration-700 ease-out group-hover/badge:rotate-[360deg] group-hover/badge:scale-110 hover:rotate-[360deg] animate-[spin_10s_linear_infinite]" />
            Tim Dokter Spesialis
          </span>
        </div>

        {/* Judul Utama */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Ditangani Langsung oleh Tim Ahli
        </h2>
      </div>

      {/* 2. INFINITE MARQUEE RUNNING TRACK CONTAINER (Tanpa efek awan di tepi) */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Infinite Track: Seamless translation with Pause-on-Hover */}
        <div className="doctor-marquee-track gap-5 sm:gap-6 px-4">
          {marqueeList.map((doctor, idx) => (
            <div
              key={`${doctor.id}-${idx}`}
              className="w-[280px] sm:w-[310px] shrink-0 bg-[#0D5966] p-2.5 sm:p-3 rounded-3xl sm:rounded-[32px] shadow-lg border border-[#0D5966]/20 flex flex-col gap-2.5 sm:gap-3 select-none"
            >
              {/* Foto Portrait di Atas: Rasio Square 1:1, full wajah terlihat jelas, TANPA EFEK HOVER */}
              <div className="relative aspect-square w-full rounded-[20px] sm:rounded-[22px] overflow-hidden bg-[#F3F5F4] border border-white/10 shadow-xs">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top pointer-events-none select-none"
                  loading="lazy"
                />
              </div>

              {/* Area Teks di Bawah (Putih Bersih #FFFFFF, Bricolage Grotesque, Tinggi Seragam Sama Persis: Hanya Nama & Spesialisasi Saja) */}
              <div className="bg-white rounded-[20px] sm:rounded-[22px] px-5 py-3.5 sm:py-4 h-[84px] sm:h-[90px] flex flex-col justify-center border border-slate-100 shadow-xs">
                {/* Baris 1: Nama Lengkap Dokter & Gelar */}
                <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                  {doctor.name}
                </h3>

                {/* Baris 2: Spesialisasi Dokter Saja */}
                <p className="text-xs sm:text-[13px] text-slate-500 mt-1 font-medium line-clamp-1">
                  {doctor.specialization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
