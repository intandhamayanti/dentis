"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Eye,
  Layers,
  HeartPulse,
  Coffee,
  CheckCircle2,
  Armchair,
} from "lucide-react";

export const BentoGrid: React.FC = () => {
  return (
    <section id="bento" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D5966]/10 text-[#0D5966] text-xs sm:text-sm font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#0D5966]" />
          <span>The dentis Difference</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D5966] tracking-tight mb-4"
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
        >
          Standar Baru Perawatan Gigi Modern
        </h2>
        <p className="text-[#64748B] text-base sm:text-lg">
          Kami mendesain ulang setiap aspek kunjungan dokter gigi agar bebas rasa takut,
          akurat secara digital, dan sehangat lounge hotel pilihan Anda.
        </p>
      </div>

      {/* Bento Grid: 4 Core Feature Cards with Modern Spacing on #FFFFFF surface */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Card 1: 3D Digital Scanning (Span 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#E2E8F0] shadow-sm p-7 sm:p-9 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D5966]/10 text-[#0D5966] text-xs font-bold mb-4">
              <Eye className="w-3.5 h-3.5" />
              <span>Fast & Precise</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-3">
              3D Digital Scanning
            </h3>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed mb-6">
              Fast, precise, no messy impression molds. Memetakan seluruh kontur gigi
              dan rahang dalam hitungan detik tanpa memicu rasa mual (gag reflex).
            </p>
          </div>

          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-inner">
            <Image
              src="/assets/scanner-3d.jpg"
              alt="Digital 3D Dental Scanning CEREC Prime"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D5966]/80 via-transparent to-transparent" />
            <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Simulasi Senyum Real-time
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Zero Messy Molds
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Painless Modern Dentistry (Span 5) */}
        <div className="lg:col-span-5 bg-[#0D5966] text-white rounded-3xl sm:rounded-[2.5rem] p-7 sm:p-9 shadow-md flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold mb-5 border border-white/20">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Gentle Touch</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white">
              Painless Modern Dentistry
            </h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
              Precision anesthesia & gentle touch. Anestesi mikro-drip terkomputerisasi
              mengalir perlahan tanpa sensasi menusuk, meredakan ketegangan hingga 85%.
            </p>

            <div className="space-y-3 text-xs sm:text-sm font-medium text-white/95">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Teknik anestesi tanpa tekanan jarum mendadak</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Headset Bose noise-cancelling selama tindakan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Teknik atraumatik untuk penyembuhan lebih cepat</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80">
              Anxiety Relief Guarantee:
            </span>
            <span className="text-sm font-extrabold text-white bg-white/20 px-3.5 py-1 rounded-full border border-white/20">
              -85% Patient Anxiety
            </span>
          </div>
        </div>

        {/* Card 3: 100% Transparent Pricing (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl sm:rounded-[2.5rem] p-7 sm:p-9 border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0D5966]/10 flex items-center justify-center text-[#0D5966] mb-5">
              <Layers className="w-6 h-6 text-[#0D5966]" />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-2">
              100% Transparent Pricing
            </h3>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed mb-6">
              Clear consultation without hidden clinic fees. Semua rincian tindakan dan
              pilihan alternatif disepakati bersama secara tertulis sebelum tindakan dimulai.
            </p>
          </div>

          <div className="bg-[#F3F5F4] p-4 rounded-2xl border border-[#E2E8F0] text-xs text-[#64748B] font-medium flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0D5966] shrink-0" />
            <div>
              <p className="font-bold text-[#0D5966]">No Hidden Surcharges:</p>
              Termasuk konsultasi steril, alat disposable medis, dan garansi perawatan.
            </div>
          </div>
        </div>

        {/* Card 4: Comfort-First Lounge (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl sm:rounded-[2.5rem] p-7 sm:p-9 border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0D5966]/10 flex items-center justify-center text-[#0D5966] mb-5">
              <Armchair className="w-6 h-6 text-[#0D5966]" />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-2">
              Comfort-First Lounge
            </h3>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed mb-6">
              Calming botanical atmosphere, non-intimidating. Kursi memory-foam ergonomis,
              layar plafon streaming Netflix, serta aromaterapi lavender yang menenangkan.
            </p>
          </div>

          <div className="bg-[#F3F5F4] p-4 rounded-2xl border border-[#E2E8F0] text-xs text-[#64748B] font-medium flex items-center gap-3">
            <Coffee className="w-5 h-5 text-[#0D5966] shrink-0" />
            <div>
              <p className="font-bold text-[#0D5966]">Hospitality Standards:</p>
              Pilihan artisan tea, infused water, dan suasana ramah tanpa aroma klinis tajam.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
