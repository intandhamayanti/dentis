"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { scrollToBookingForm } from "../../lib/navigation";

// 5 Visual Avatar Pasien Nyata Indonesia dengan Senyum Sehat Cerah
const HERO_PATIENT_AVATARS = [
  { src: "/assets/avatars/avatar-1.jpg", alt: "Pasien Dentis 1" },
  { src: "/assets/avatars/avatar-2.jpg", alt: "Pasien Dentis 2" },
  { src: "/assets/avatars/avatar-3.jpg", alt: "Pasien Dentis 3" },
  { src: "/assets/avatars/avatar-4.jpg", alt: "Pasien Dentis 4" },
  { src: "/assets/avatars/avatar-5.jpg", alt: "Pasien Dentis 5" },
];

export const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* ========================================================================= */}
      {/* 1. TAMPILAN DESKTOP (lg:block): 2 Foto Asimetris & Row Editorial Sejajar */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        {/* Visual Split 2 Kolom Asimetris dengan DNA Dentis (Bungkus Hijau #0D5966) */}
        <div className="bg-[#0D5966] p-3.5 lg:p-4 rounded-[32px] lg:rounded-[36px] shadow-xl border border-[#0D5966]/20 relative overflow-hidden">
          <div className="flex flex-row gap-3.5 lg:gap-4 w-full items-stretch">
            {/* Kartu Kiri (63.5%): Suasana Klinik Modern */}
            <div className="w-[63.5%] h-[380px] lg:h-[420px] rounded-[22px] lg:rounded-[26px] overflow-hidden relative shadow-xs border border-white/10 bg-slate-900 select-none">
              <Image
                src="/assets/hero-clinic-operatory.jpg"
                alt="Suasana klinik gigi modern dentis dengan fasilitas berteknologi tinggi dan pemandangan kota"
                fill
                priority
                className="object-cover object-center pointer-events-none select-none"
                sizes="65vw"
              />
            </div>

            {/* Kartu Kanan (36.5%): Pasien Perempuan Senyum Alami */}
            <div className="w-[36.5%] h-[380px] lg:h-[420px] rounded-[22px] lg:rounded-[26px] overflow-hidden relative shadow-xs border border-white/10 bg-slate-900 select-none">
              <Image
                src="/assets/hero-patient-smile.jpg"
                alt="Pasien perempuan Indonesia dengan senyum alami dan percaya diri di klinik dentis"
                fill
                priority
                className="object-cover object-[center_35%] pointer-events-none select-none"
                sizes="38vw"
              />
            </div>
          </div>
        </div>

        {/* Editorial & Action Bar Row (Button disejajarkan ke bawah dengan deskripsi) */}
        <div className="mt-10 lg:mt-12 grid grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-stretch">
          {/* Kolom Kiri: Brand Narrative */}
          <div className="col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-[#0D5966] leading-tight">
                Perawatan Gigi Presisi.<br />
                Hasil Senyum Alami.
              </h1>
              <p className="text-slate-600 text-base max-w-xl mt-4 leading-relaxed font-normal">
                Perawatan estetika dan restorasi modern dengan keunggulan klinis serta ketelitian tinggi untuk hasil senyum sehat dan percaya diri.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Social Proof di atas, Tombol di bawah sejajar desc */}
          <div className="col-span-5 flex flex-col justify-between pt-1">
            {/* Social Proof: Stars + Avatars */}
            <div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 text-[#D97706]" aria-label="Rating 5 dari 5 bintang">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-700 ml-1">4.9</span>
              </div>

              <div className="flex items-center gap-3.5 mt-3">
                <div className="flex items-center -space-x-2.5 shrink-0">
                  {HERO_PATIENT_AVATARS.map((avatar, idx) => (
                    <div
                      key={idx}
                      className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-xs ring-1 ring-slate-900/5 bg-slate-200"
                    >
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-500 font-medium leading-snug">
                  Dipercaya oleh 12.400+ pasien di Indonesia
                </span>
              </div>
            </div>

            {/* Tombol Aksi: Berjarak lega dan disejajarkan ke bawah sesuai deskripsi kiri */}
            <div className="pt-8 lg:pt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToBookingForm()}
                className="bg-[#0D5966] hover:bg-[#09414B] text-white px-7 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2 cursor-pointer group"
              >
                <span>Reservasi Konsultasi</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </button>

              <button
                onClick={() => scrollTo("services")}
                className="bg-white border border-slate-300 hover:border-[#0D5966] text-slate-700 hover:text-[#0D5966] px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200 inline-flex items-center cursor-pointer"
              >
                <span>Pelajari Layanan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAMPILAN MOBILE & TABLET (lg:hidden): Persis Urutan Gambar Referensi */}
      {/* 1. Foto (1 Foto Saja)                                                     */}
      {/* 2. Social Proof (Bintang + Avatars)                                      */}
      {/* 3. Heading ("Perawatan Gigi Presisi...")                                 */}
      {/* 4. Description                                                           */}
      {/* 5. Buttons Full Width Stacked                                            */}
      {/* ========================================================================= */}
      <div className="block lg:hidden">
        {/* 1. FOTO: 1 Foto Saja di Mobile (Clean Borderless Tanpa Stroke Sesuai Referensi) */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/10] h-[230px] sm:h-[320px] rounded-[24px] sm:rounded-[28px] overflow-hidden relative shadow-sm select-none">
          <Image
            src="/assets/hero-clinic-operatory.jpg"
            alt="Suasana klinik gigi modern dentis dengan fasilitas berteknologi tinggi"
            fill
            priority
            className="object-cover object-center pointer-events-none select-none"
            sizes="(max-width: 1024px) 100vw, 600px"
          />
        </div>

        {/* 2. SOCIAL PROOF (Langsung di bawah Foto, Persis Gambar Referensi) */}
        <div className="mt-5 sm:mt-6">
          {/* Bintang + 4.9 */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-0.5 text-[#D97706]" aria-label="Rating 5 dari 5 bintang">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-700 ml-1">4.9</span>
          </div>

          {/* Avatar Stack + Text */}
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2 shrink-0">
              {HERO_PATIENT_AVATARS.map((avatar, idx) => (
                <div
                  key={idx}
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-white shadow-xs ring-1 ring-slate-900/5 bg-slate-200"
                >
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              ))}
            </div>
            <span className="text-xs sm:text-sm text-slate-500 font-medium leading-snug">
              Dipercaya oleh 12.400+ pasien di Indonesia
            </span>
          </div>
        </div>

        {/* 3. HEADING (Di bawah Social Proof) */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0D5966] leading-[1.2] mt-5 sm:mt-6">
          Perawatan Gigi Presisi.<br />
          Hasil Senyum Alami.
        </h1>

        {/* 4. DESCRIPTION (Di bawah Heading) */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-3">
          Perawatan estetika dan restorasi modern dengan keunggulan klinis serta ketelitian tinggi untuk hasil senyum sehat dan percaya diri.
        </p>

        {/* 5. BUTTONS (Stacked Full Width di Bawah, Persis Gambar Referensi) */}
        <div className="mt-7 sm:mt-8 flex flex-col gap-3 w-full">
          {/* Tombol Utama (Primary) */}
          <button
            onClick={() => scrollToBookingForm()}
            className="w-full py-3.5 px-6 rounded-full bg-[#0D5966] hover:bg-[#09414B] text-white font-semibold text-sm sm:text-base tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 group"
          >
            <span>Reservasi Konsultasi</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          </button>

          {/* Tombol Sekunder (Outline) */}
          <button
            onClick={() => scrollTo("services")}
            className="w-full py-3.5 px-6 rounded-full bg-white border border-slate-300 hover:border-[#0D5966] text-slate-700 hover:text-[#0D5966] font-semibold text-sm sm:text-base tracking-wide flex items-center justify-center cursor-pointer transition-colors duration-200"
          >
            <span>Pelajari Layanan</span>
          </button>
        </div>
      </div>
    </section>
  );
};
