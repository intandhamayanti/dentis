"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Bagaimana cara melakukan reservasi jadwal perawatan di Dentis?",
    answer:
      "Cukup klik tombol 'Reservasi Jadwal', pilih jenis layanan, tentukan dokter spesialis atau dokter umum pilihan Anda, lalu pilih tanggal dan jam yang tersedia secara instan.",
  },
  {
    id: "faq-2",
    question:
      "Apakah saya bisa menjadwalkan konsultasi awal terlebih dahulu tanpa langsung tindakan?",
    answer:
      "Tentu saja. Kami sangat menyarankan sesi konsultasi awal dan digital scan terlebih dahulu agar Anda dapat berdiskusi santai dengan dokter mengenai rencana dan estimasi perawatan.",
  },
  {
    id: "faq-3",
    question:
      "Bagaimana jika saya perlu mengubah jadwal (reschedule) atau membatalkan janji?",
    answer:
      "Anda dapat mengubah jadwal atau membatalkan janji temu secara mandiri melalui tautan konfirmasi WhatsApp maksimal 24 jam sebelum jadwal kunjungan tanpa dikenakan biaya.",
  },
  {
    id: "faq-4",
    question:
      "Berapa lama waktu tunggu saat datang ke klinik jika sudah reservasi online?",
    answer:
      "Sistem reservasi Dentis berbasis appointment-first dengan slot waktu yang terjadwal ketat. Waktu tunggu Anda di klinik rata-rata kurang dari 10 menit sebelum masuk ke ruang perawatan.",
  },
  {
    id: "faq-5",
    question: "Apakah saya perlu membayar biaya reservasi (DP) di awal?",
    answer:
      "Reservasi online bebas biaya awal. Pembayaran tindakan dapat dilakukan langsung di klinik setelah perawatan selesai melalui debit, kartu kredit (tersedia cicilan 0%), maupun asuransi rekanan.",
  },
];

export const FaqSection: React.FC = () => {
  // Buka item pertama secara default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* 2-Kolom Split Kiri & Kanan (Persis seperti section Hasil Nyata / Transformations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* ================= KOLOM KIRI (Sticky Sidebar - 5 kolom): Eyebrow, Title & Subtitle ================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
          {/* Eyebrow Badge Pill */}
          <div className="w-fit">
            <span className="group/badge inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0D5966]/10 hover:bg-[#0D5966]/15 text-[#0D5966] text-xs sm:text-sm font-semibold tracking-wide border border-[#0D5966]/15 shadow-xs transition-all cursor-pointer">
              <AsteriskIcon className="w-3.5 h-3.5 text-[#0D5966] transition-transform duration-700 ease-out group-hover/badge:rotate-[360deg] group-hover/badge:scale-110 hover:rotate-[360deg] animate-[spin_10s_linear_infinite]" />
              Reservasi &amp; Kunjungan
            </span>
          </div>

          {/* Judul Display */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight mt-4 sm:mt-5">
            Hal yang Sering Ditanyakan Seputar Booking.
          </h2>
        </div>

        {/* ================= KOLOM KANAN (7 kolom): SATU CONTAINER HIJAU DENTIS MENYATU (#0D5966) MEMBUNGKUS ACCORDION PUTIH ================= */}
        <div className="lg:col-span-7 bg-[#0D5966] p-3 sm:p-4 lg:p-5 rounded-[28px] sm:rounded-[36px] shadow-lg border border-[#0D5966]/20 flex flex-col gap-3 sm:gap-3.5">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-[20px] sm:rounded-[24px] overflow-hidden border border-slate-100 shadow-xs transition-all duration-200"
              >
                {/* Accordion Trigger Button */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-5 py-4 sm:px-7 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base lg:text-[17px] font-bold text-slate-900 tracking-tight leading-snug">
                    {faq.question}
                  </span>

                  {/* Modern Plus/Minus Icon Button with 45-degree rotation */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#0D5966] text-white rotate-45"
                        : "bg-slate-100 text-slate-700 group-hover:bg-[#0D5966]/10 group-hover:text-[#0D5966]"
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {/* Accordion Content with Smooth Framer Motion Collapse */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-7 sm:pb-6 pt-1 text-slate-600 text-xs sm:text-sm lg:text-[14.5px] leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
