"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useDentalStore } from "@/context/DentalContext";
import { scrollToBookingForm } from "../../lib/navigation";

interface PatientCardProps {
  imageSrc: string;
  alt: string;
  defaultRotateDeg: number;
}

const PatientCard: React.FC<PatientCardProps> = ({
  imageSrc,
  alt,
  defaultRotateDeg,
}) => {
  return (
    <div
      style={{ transform: `rotate(${defaultRotateDeg}deg)` }}
      className="relative shrink-0 w-[130px] sm:w-[160px] md:w-[185px] lg:w-[205px] aspect-[4/5] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-md shadow-black/20 select-none bg-slate-100"
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 130px, (max-width: 1024px) 185px, 210px"
        className="object-cover object-center pointer-events-none"
        priority
      />
    </div>
  );
};

export const CtaBannerSection: React.FC = () => {
  const { openBookingModal } = useDentalStore();

  const handleBooking = () => {
    if (typeof window !== "undefined" && document.getElementById("booking-form")) {
      scrollToBookingForm();
    } else {
      openBookingModal();
    }
  };

  return (
    <section
      id="cta-banner"
      className="w-full bg-[#0D5966] py-16 sm:py-20 lg:py-24 overflow-hidden font-['Bricolage_Grotesque',sans-serif] relative border-b border-white/10"
    >
      {/* Subtle Ambient Radial Glows */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-white/[0.07] rounded-full blur-[90px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 right-10 w-[400px] h-[250px] bg-[#167485]/30 rounded-full blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop View (lg and above): 3-Column Split (Left Card | Center Copy | Right Card) */}
        <div className="hidden lg:flex flex-row items-center justify-between gap-6">
          {/* Sisi Kiri: Pasien Wanita */}
          <PatientCard
            imageSrc="/assets/cta-patient-1.jpg"
            alt="Pasien wanita dentis tersenyum cerah di klinik modern"
            defaultRotateDeg={-7}
          />

          {/* Tengah: Penataan Copy Bersih Editorial Sesuai Referensi (Warna Putih Elegan) */}
          <div className="flex flex-col items-center text-center max-w-xl mx-auto px-2">
            <h2 className="text-[44px] font-bold text-white tracking-tight leading-[1.18] mb-5">
              Reservasi Perawatan Gigi
              <br /> Anda Hari Ini
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed max-w-xl mb-8 font-normal">
              Nikmati pengalaman perawatan dental modern yang tenang, nyaman, dan presisi. Jadwalkan kunjungan Anda sekarang bersama tim dokter spesialis dentis.
            </p>
            {/* Action Buttons: Booking Sekarang + Konsultasi Gratis (WhatsApp) */}
            <div className="flex flex-row items-center justify-center gap-3.5 sm:gap-4 flex-wrap">
              <button
                onClick={handleBooking}
                className="group inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#0D5966] font-semibold text-[15px] px-8 py-3.5 rounded-full shadow-md transition-all duration-200 cursor-pointer select-none"
              >
                <span>Booking Sekarang</span>
                <ArrowUpRight className="w-4 h-4 text-[#0D5966] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </button>
              <a
                href="https://wa.me/6282123456789?text=Halo%20dentis%2C%20saya%20ingin%20konsultasi%20gratis%20mengenai%20perawatan%20gigi."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/35 hover:border-white font-medium text-[15px] px-7 py-3.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 cursor-pointer select-none"
              >
                <span>Konsultasi Gratis</span>
              </a>
            </div>
          </div>

          {/* Sisi Kanan: Pasien Pria */}
          <PatientCard
            imageSrc="/assets/cta-patient-2.jpg"
            alt="Pasien pria dentis tersenyum rapi dengan behel di klinik modern"
            defaultRotateDeg={7}
          />
        </div>

        {/* Mobile / Tablet View (< lg): Copy di Atas, 2 Foto Berdampingan Cantik di Bawah */}
        <div className="flex lg:hidden flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-[1.2] mb-4">
            Reservasi Perawatan Gigi
            <br /> Anda Hari Ini
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-md mb-6 font-normal">
            Nikmati pengalaman perawatan dental modern yang tenang, nyaman, dan presisi. Jadwalkan kunjungan Anda sekarang bersama tim dokter spesialis dentis.
          </p>

          {/* Mobile Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mb-8">
            <button
              onClick={handleBooking}
              className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#0D5966] font-semibold text-sm px-7 py-3 rounded-full shadow-md transition-all duration-200 cursor-pointer select-none"
            >
              <span>Booking Sekarang</span>
              <ArrowUpRight className="w-4 h-4 text-[#0D5966] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </button>
            <a
              href="https://wa.me/6282123456789?text=Halo%20dentis%2C%20saya%20ingin%20konsultasi%20gratis%20mengenai%20perawatan%20gigi."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/35 hover:border-white font-medium text-sm px-6 py-3 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 cursor-pointer select-none"
            >
              <span>Konsultasi Gratis</span>
            </a>
          </div>

          {/* 2 Foto Berdampingan Miring Cantik */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
            <PatientCard
              imageSrc="/assets/cta-patient-1.jpg"
              alt="Pasien wanita dentis tersenyum cerah di klinik modern"
              defaultRotateDeg={-6}
            />
            <PatientCard
              imageSrc="/assets/cta-patient-2.jpg"
              alt="Pasien pria dentis tersenyum rapi dengan behel di klinik modern"
              defaultRotateDeg={6}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
