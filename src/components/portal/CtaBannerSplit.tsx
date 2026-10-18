"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { useDentalStore } from "@/context/DentalContext";
import { scrollToBookingForm } from "../../lib/navigation";

// Authentic 4-color Google G icon
const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const AVATARS = [
  { src: "/assets/avatars/avatar-1.jpg", alt: "Pasien Dentis" },
  { src: "/assets/avatars/avatar-2.jpg", alt: "Pasien Dentis" },
  { src: "/assets/avatars/avatar-3.jpg", alt: "Pasien Dentis" },
  { src: "/assets/avatars/avatar-4.jpg", alt: "Pasien Dentis" },
];

export const CtaBannerSplit: React.FC = () => {
  const { openBookingModal } = useDentalStore();
  const [activePhoto, setActivePhoto] = useState<string>("/assets/cta-patient-braces.jpg");

  const handleBooking = () => {
    if (typeof window !== "undefined" && document.getElementById("booking-form")) {
      scrollToBookingForm();
    } else {
      openBookingModal();
    }
  };

  return (
    <div className="w-full font-['Bricolage_Grotesque',sans-serif]">
      {/* Split 2-Card Layout (Sesuai Referensi Gambar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* ================= CARD KIRI: FOTO PERAWATAN GIGI / BEHEL ================= */}
        <div className="lg:col-span-5 relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[340px] sm:min-h-[420px] lg:min-h-[490px] bg-slate-100 shadow-xl shadow-slate-900/5 border border-slate-200/80 group">
          <Image
            src={activePhoto}
            alt="Pemeriksaan dan penyesuaian behel gigi di klinik Dentis modern"
            fill
            className="object-cover object-[62%_35%] transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            sizes="(max-width: 1024px) 100vw, 42vw"
            priority
          />

          {/* Vignette Gradasi Halus */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

          {/* Badge Atas: Spesialisasi */}
          <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-xs text-xs font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ortodonti &amp; Estetika Gigi
            </span>
          </div>

          {/* Footer Info Kartu Foto: Opsi Ganti Foto Cepat (Behel / Ruang Operatori / Senyum) */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 z-10 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-white text-xs font-medium drop-shadow-sm hidden sm:inline-block">
              Perawatan Nyata Pasien Dentis
            </span>
            <div className="inline-flex items-center p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setActivePhoto("/assets/cta-patient-braces.jpg")}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  activePhoto === "/assets/cta-patient-braces.jpg"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Foto Behel (Kirim)
              </button>
              <button
                type="button"
                onClick={() => setActivePhoto("/assets/hero-patient-smile.jpg")}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  activePhoto === "/assets/hero-patient-smile.jpg"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Foto Senyum
              </button>
            </div>
          </div>
        </div>

        {/* ================= CARD KANAN: HIJAU DENTIS (#0D5966) DENGAN COPY & CTA ================= */}
        <div className="lg:col-span-7 relative bg-[#0D5966] text-white rounded-[28px] sm:rounded-[36px] p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between shadow-2xl shadow-[#0D5966]/20 border border-[#0D5966]/30 overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[490px]">
          
          {/* Subtle Ambient Radial Glows */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 bg-white/[0.08] rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#167485]/40 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Bagian Atas: Eyebrow + Judul Utama Besar Sesuai Layout Referensi */}
          <div className="relative z-10">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-[13px] font-semibold w-fit mb-5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
              <span>Reservasi Tanpa Antre</span>
            </div>

            {/* Judul Besar (Persis Layout: "We'll give you a reason to smile more. Sign up today.") */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-white tracking-tight leading-[1.15] mb-4 sm:mb-5">
              Kami beri Anda alasan untuk tersenyum lebih lepas. Reservasi hari ini.
            </h2>

            {/* Deskripsi Tambahan yang Bersih & Elegan */}
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Nikmati kenyamanan perawatan dental modern yang tenang, dokter spesialis berpengalaman, dan kepastian jadwal tanpa waktu tunggu panjang.
            </p>
          </div>

          {/* Bagian Bawah: Social Proof Ulasan Google & Tombol Book Online */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-7 sm:pt-8 mt-6 sm:mt-8 border-t border-white/15">
            
            {/* Sisi Kiri Bawah: Stack Avatar + Rating + Google Reviews */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar Stack 4 Pasien */}
              <div className="flex items-center">
                {AVATARS.map((avatar, idx) => (
                  <div
                    key={idx}
                    className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0D5966] -ml-2.5 first:ml-0 overflow-hidden shadow-sm shrink-0 bg-slate-200"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Nilai Rating & Label Ulasan Google */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-base sm:text-lg leading-none">
                    4.9
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-300 text-amber-300"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-white/80 text-xs sm:text-sm font-medium">
                    1.200+ Ulasan di
                  </span>
                  <span className="inline-flex items-center gap-1 text-white font-semibold text-xs sm:text-sm">
                    <GoogleIcon className="w-3.5 h-3.5" />
                    Google
                  </span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan Bawah: Tombol Aksi Book Online */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleBooking}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-[#0D5966] font-bold text-sm sm:text-[15px] px-8 py-3.5 sm:py-4 rounded-full shadow-lg transition-colors duration-200 cursor-pointer select-none"
              >
                <span>Book Online</span>
                <ArrowUpRight className="w-4 h-4 text-[#0D5966] shrink-0" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
