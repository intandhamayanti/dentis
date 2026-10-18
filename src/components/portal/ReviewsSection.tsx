"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface PatientReview {
  id: string;
  name: string;
  service: string;
  quote: string;
  rating: number;
  imageSrc: string;
  imageAlt: string;
}

// 6 Testimoni Pasien Indonesia Asli (3 pasang untuk tampilan 2 card berdampingan)
const REVIEWS_DATA: PatientReview[] = [
  {
    id: "rev-1",
    name: "Nadia Anindita",
    service: "Clear Aligners",
    quote:
      "Dulu selalu ragu pasang behel karena tuntutan pekerjaan sering meeting. Di dentis, simulasi 3D-nya jelas dan alignernya benar-benar transparan tak terlihat. Sekarang senyum jauh lebih percaya diri.",
    rating: 5,
    imageSrc: "/assets/reviews/After-Treatment Smile in a Modern Clinic.png",
    imageAlt: "Pasien wanita senyum rapi dan cerah setelah perawatan clear aligners di dentis",
  },
  {
    id: "rev-2",
    name: "Raditya Pratama",
    service: "Pembersihan Karang (Scaling)",
    quote:
      "Bertahun-tahun selalu menunda ke dokter gigi karena trauma ngilu. Di dentis sama sekali tanpa penghakiman, dokter sangat teliti dan suasananya setenang lounge hotel. Rutin kontrol tiap enam bulan tanpa ragu.",
    rating: 5,
    imageSrc: "/assets/reviews/Happy Patient at the Dentist.png",
    imageAlt: "Pasien pria puas dan rileks setelah scaling gigi di dentis",
  },
  {
    id: "rev-3",
    name: "Citra Kirana Putri",
    service: "Veneer Gigi Porselen",
    quote:
      "Veneer porselennya sangat teliti disesuaikan proporsi senyum dan warna kulit wajah. Nggak terkesan kaku atau terlalu putih buatan. Hasilnya halus, natural, dan bikin senyum terlihat segar elegan.",
    rating: 5,
    imageSrc: "/assets/reviews/Smiling Patient in Modern Dental Clinic.png",
    imageAlt: "Pasien wanita berhijab dengan senyum natural veneer porselen di dentis",
  },
  {
    id: "rev-4",
    name: "Hendra Wijaya",
    service: "Implan Gigi Spesialis",
    quote:
      "Implan digital CEREC sangat canggih dan tanpa cetak lilin manual yang bikin enek. Prosesnya cepat, presisi, dan minim rasa sakit. Sore hari setelah tindakan saya sudah bisa makan santai.",
    rating: 5,
    imageSrc: "/assets/reviews/Relaxed Smile in the Dental Chair.png",
    imageAlt: "Pasien pria dewasa tersenyum nyaman setelah perawatan implan gigi di dentis",
  },
  {
    id: "rev-5",
    name: "Maya Sasmita (Ibu dari Aira)",
    service: "Gigi Anak & Keluarga",
    quote:
      "Anak pertama saya dulu histeris setiap dengar kata dokter gigi. Di dentis pendekatannya sangat lembut dan menyenangkan. Sekarang dia sendiri yang antusias minta kontrol rutin tanpa dipaksa.",
    rating: 5,
    imageSrc: "/assets/reviews/Joyful Smile at the Dentist.png",
    imageAlt: "Pasien anak perempuan tersenyum ceria dan antusias di klinik gigi anak dentis",
  },
  {
    id: "rev-6",
    name: "Dimas Prasetyo",
    service: "Laser Whitening Gigi",
    quote:
      "Treatment laser whitening di dentis cuma butuh waktu satu jam dan hasilnya naik beberapa tingkat lebih cerah natural tanpa rasa ngilu sama sekali. Pelayanan dokter dan stafnya sangat profesional.",
    rating: 5,
    imageSrc: "/assets/reviews/Relaxed Smile in a Modern Dental Clinic.png",
    imageAlt: "Pasien pria profesional dengan senyum gigi putih cerah alami di dentis",
  },
];

export const ReviewsSection: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  const totalPages = Math.ceil(REVIEWS_DATA.length / 2);

  const prevReview = useCallback(() => {
    setDirection(-1);
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const nextReview = useCallback(() => {
    setDirection(1);
    setPageIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevReview();
      if (e.key === "ArrowRight") nextReview();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevReview, nextReview]);

  // Autoplay (7s pause when hovering)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextReview();
    }, 7000);
    return () => clearInterval(timer);
  }, [nextReview, isPaused]);

  // Pasangan 2 card aktif untuk halaman saat ini
  const activePair = [
    REVIEWS_DATA[pageIndex * 2],
    REVIEWS_DATA[pageIndex * 2 + 1],
  ].filter(Boolean);

  return (
    <section
      id="reviews"
      className="scroll-mt-28 py-16 sm:py-20 lg:py-24 relative overflow-hidden font-['Bricolage_Grotesque',sans-serif]"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= 1. HEADER SECTION (With Simple Navigation) ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            {/* Eyebrow Pill */}
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D5966]/10 text-[#0D5966] text-xs font-semibold tracking-wide border border-[#0D5966]/15">
                <AsteriskIcon className="w-3.5 h-3.5 text-[#0D5966]" />
                Pengalaman Pasien
              </span>
            </div>

            {/* Judul Utama */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Senyum Nyaman, Cerita Nyata.
            </h2>
          </div>

          {/* Simple Navigation Arrows (Simple, Bersih & Tidak Lebay) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={prevReview}
              aria-label="Testimoni sebelumnya"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextReview}
              aria-label="Testimoni selanjutnya"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= 2. CAROUSEL STAGE: 2 CARDS FULL WIDTH ================= */}
        <div
          className="w-full relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden min-h-[300px] flex items-center">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={pageIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 w-full"
              >
                {activePair.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#0D5966] p-3 sm:p-3.5 lg:p-4 rounded-[26px] sm:rounded-[30px] border border-[#0D5966]/20 shadow-lg flex flex-col sm:flex-row gap-3 items-stretch"
                  >
                    {/* Foto Pasien / Klinik di Sisi Kiri */}
                    <div className="relative overflow-hidden rounded-[18px] sm:rounded-[22px] w-full sm:w-[42%] h-[180px] sm:h-auto min-h-[180px] sm:min-h-[220px] bg-slate-900 border border-white/10 shrink-0">
                      <Image
                        src={review.imageSrc}
                        alt={review.imageAlt}
                        fill
                        priority
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 320px"
                        className="object-cover object-center select-none"
                      />
                    </div>

                    {/* Kartu Putih Testimoni Bersih (Bintang, Review, Nama Pasien) */}
                    <div className="flex-1 rounded-[18px] sm:rounded-[22px] bg-white p-5 sm:p-6 flex flex-col justify-between shadow-xs border border-slate-100">
                      <div>
                        {/* 5 Bintang Emas */}
                        <div className="flex items-center gap-1 text-amber-400 mb-2.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>

                        {/* Kutipan Review */}
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                          &ldquo;{review.quote}&rdquo;
                        </p>
                      </div>

                      {/* Identitas Pasien Sederhana: Nama & Layanan (Tanpa Dokter, Tanpa Button) */}
                      <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm sm:text-[15px] text-slate-900 tracking-tight block">
                            {review.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {review.service}
                          </span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Simple Clean Dots Indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > pageIndex ? 1 : -1);
                  setPageIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === pageIndex
                    ? "w-6 bg-[#0D5966]"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Buka halaman testimoni ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
