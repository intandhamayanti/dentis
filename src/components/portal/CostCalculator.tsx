"use client";

import React, { useState, useMemo } from "react";
import { useDentalStore } from "@/context/DentalContext";
import {
  Calculator,
  Clock,
  ShieldCheck,
  Check,
  ArrowUpRight,
  Info,
  BadgePercent,
} from "lucide-react";

export const CostCalculator: React.FC = () => {
  const { services, openBookingModal, cmsConfig } = useDentalStore();

  const [selectedServiceId, setSelectedServiceId] = useState<string>("srv-scaling");
  const [complexity, setComplexity] = useState<"routine" | "moderate" | "advanced">("routine");
  const [unitCount, setUnitCount] = useState<number>(1);

  const currentService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  // Dynamic calculation based on complexity and unit
  const calculation = useMemo(() => {
    if (!currentService) {
      return { min: 0, max: 0, discountedMin: 0, duration: 45, discountPercent: 0 };
    }

    const multiplier =
      complexity === "routine" ? 1.0 : complexity === "moderate" ? 1.35 : 1.75;

    let baseMin = currentService.basePrice;
    let baseMax = currentService.maxPrice;

    // Unit adjustment for veneers / restoration / aligners
    if (currentService.id === "srv-veneers") {
      baseMin = currentService.basePrice * unitCount;
      baseMax = currentService.maxPrice * unitCount;
    } else if (currentService.id === "srv-restoration") {
      baseMin = currentService.basePrice * Math.max(1, unitCount);
      baseMax = currentService.maxPrice * Math.max(1, unitCount);
    } else if (currentService.id === "srv-aligners" && unitCount === 2) {
      baseMin = currentService.basePrice * 1.6;
      baseMax = currentService.maxPrice;
    }

    const finalMin = Math.round((baseMin * multiplier) / 10000) * 10000;
    const finalMax = Math.round((baseMax * multiplier) / 10000) * 10000;

    const discountAmount = Math.round(
      (finalMin * (cmsConfig.promoDiscountPercent || 0)) / 100
    );

    const duration =
      complexity === "routine"
        ? currentService.durationMinutes
        : complexity === "moderate"
        ? Math.round(currentService.durationMinutes * 1.25)
        : Math.round(currentService.durationMinutes * 1.5);

    return {
      min: finalMin,
      max: finalMax,
      discountedMin: finalMin - discountAmount,
      duration,
      discountPercent: cmsConfig.promoDiscountPercent || 0,
    };
  }, [currentService, complexity, unitCount, cmsConfig.promoDiscountPercent]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D5966]/10 text-[#0D5966] text-xs sm:text-sm font-semibold mb-4">
          <Calculator className="w-3.5 h-3.5" />
          <span>Transparansi Biaya Perawatan</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D5966] tracking-tight mb-4"
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
        >
          Kalkulator Estimasi Biaya
        </h2>
        <p className="text-slate-600 text-base sm:text-lg">
          Tanpa biaya tersembunyi. Dapatkan simulasi perkiraan biaya tindakan
          dental Anda secara transparan sebelum berkonsultasi di klinik.
        </p>
      </div>

      {/* Main Interactive Grid Card */}
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Form & Selectors */}
        <div className="lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
          <div className="space-y-8">
            {/* 1. Category / Service Selectors */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                1. Pilih Jenis Perawatan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {services.map((srv) => {
                  const isSelected = srv.id === selectedServiceId;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        if (srv.id === "srv-veneers") setUnitCount(4);
                        else setUnitCount(1);
                      }}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-[#0D5966] bg-[#0D5966]/5 ring-2 ring-[#0D5966]/20 shadow-xs"
                          : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? "text-[#0D5966]" : "text-slate-800"
                          }`}
                        >
                          {srv.shortName}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#0D5966] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Mulai {formatIDR(srv.basePrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Complexity / Severity Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Tingkat Kompleksitas / Kasus
                </label>
                <span className="text-xs text-slate-400 font-medium">
                  Konsultasi menentukan tingkat final
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    id: "routine",
                    title: "Ringan / Rutin",
                    desc: "Kasus standar reguler",
                  },
                  {
                    id: "moderate",
                    title: "Sedang",
                    desc: "Ada karies/stain mendalam",
                  },
                  {
                    id: "advanced",
                    title: "Kompleks",
                    desc: "Perlu rekontur/kasus berat",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setComplexity(item.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      complexity === item.id
                        ? "bg-[#0D5966] text-white border-[#0D5966] shadow-sm font-semibold"
                        : "bg-[#F3F5F4] hover:bg-slate-200/70 text-slate-700 border-slate-200"
                    }`}
                  >
                    <div className="text-xs font-bold">{item.title}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        complexity === item.id ? "text-white/80" : "text-slate-500"
                      }`}
                    >
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Conditional Quantity Selector */}
            {currentService.id === "srv-veneers" && (
              <div className="bg-[#F3F5F4] p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Jumlah Elemen Gigi Veneer
                  </label>
                  <span className="text-xs font-bold text-[#0D5966]">
                    {unitCount} Gigi
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={unitCount}
                  onChange={(e) => setUnitCount(parseInt(e.target.value))}
                  className="w-full accent-[#0D5966] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
                  <span>1 Gigi</span>
                  <span>4 Gigi (Front)</span>
                  <span>8 Gigi (Full Smile)</span>
                  <span>10 Gigi</span>
                </div>
              </div>
            )}

            {currentService.id === "srv-restoration" && (
              <div className="bg-[#F3F5F4] p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Estimasi Jumlah Gigi Berlubang
                  </label>
                  <span className="text-xs font-bold text-[#0D5966]">
                    {unitCount} Titik Tambal
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setUnitCount(num)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                        unitCount === num
                          ? "bg-[#0D5966] text-white border-[#0D5966]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {num} {num > 3 ? "Titik+" : "Titik"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-[#0D5966] shrink-0" />
            <span>
              Estimasi sudah mencakup konsultasi awal, alat steril standar autoclave,
              dan perlengkapan kenyamanan pasien.
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Price Summary Box */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#F3F5F4] to-[#e7ebe9] p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ringkasan Estimasi
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#0D5966]/10 text-[#0D5966] text-[11px] font-bold px-3 py-1 rounded-full border border-[#0D5966]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0D5966]" />
                Garansi Transparan
              </span>
            </div>

            {/* Treatment Name & Details */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#0D5966] mb-1">
                {currentService.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {currentService.description}
              </p>
            </div>

            {/* Key Treatment Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#0D5966]" />
                  <span>Durasi Tindakan</span>
                </div>
                <div className="text-base font-extrabold text-[#1E293B]">
                  ~{calculation.duration} Menit
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <BadgePercent className="w-3.5 h-3.5 text-[#0D5966]" />
                  <span>Promo Bulan Ini</span>
                </div>
                <div className="text-base font-extrabold text-[#0D5966]">
                  Hemat {calculation.discountPercent}%
                </div>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2 mb-8 bg-white/80 p-4 rounded-2xl border border-slate-200/70">
              <div className="text-xs font-bold text-slate-700 mb-1">
                Termasuk Dalam Paket:
              </div>
              {currentService.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <Check className="w-3.5 h-3.5 text-[#0D5966] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Total Box & CTA */}
          <div className="pt-4 border-t border-slate-300/80">
            <div className="mb-4">
              <div className="text-xs text-slate-500 font-medium mb-1">
                Perkiraan Rentang Biaya (IDR):
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl sm:text-3xl font-black text-[#0D5966] tracking-tight">
                  {formatIDR(calculation.min)}
                </div>
                <span className="text-sm font-semibold text-slate-400">s/d</span>
                <div className="text-lg sm:text-xl font-bold text-slate-700">
                  {formatIDR(calculation.max)}
                </div>
              </div>
              {calculation.discountPercent > 0 && (
                <p className="text-[11px] text-[#0D5966] font-semibold mt-1">
                  *Harga promo setelah diskon: mulai{" "}
                  {formatIDR(calculation.discountedMin)}
                </p>
              )}
            </div>

            <button
              onClick={() => openBookingModal(currentService.id)}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#0D5966] hover:bg-[#083d47] text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition-all active:scale-95 cursor-pointer text-sm sm:text-base group"
            >
              <span>Book Layanan Ini Sekarang</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
