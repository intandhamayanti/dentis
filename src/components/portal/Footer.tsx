"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDentalStore } from "@/context/DentalContext";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { BookingCheckoutModal, BookingIntakeData } from "./BookingCheckoutModal";

interface BusinessHourItem {
  day: string;
  hours: string;
  isOpen: boolean;
}

const BUSINESS_HOURS: BusinessHourItem[] = [
  { day: "Senin", hours: "10.00 - 19.00 WIB", isOpen: true },
  { day: "Selasa", hours: "10.00 - 19.00 WIB", isOpen: true },
  { day: "Rabu", hours: "10.00 - 19.00 WIB", isOpen: true },
  { day: "Kamis", hours: "10.00 - 19.00 WIB", isOpen: true },
  { day: "Jumat", hours: "10.00 - 19.00 WIB", isOpen: true },
  { day: "Sabtu", hours: "Tutup", isOpen: false },
  { day: "Minggu", hours: "Tutup", isOpen: false },
];

export const Footer: React.FC = () => {
  const { showToast } = useDentalStore();

  const [bookingForm, setBookingForm] = useState<BookingIntakeData>({
    name: "",
    phone: "",
    notes: "",
    service: "Pemeriksaan Gigi & Konsultasi Dokter",
    date: "",
    session: "11:00",
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Initialize date on client to match local date without hydration error
  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setBookingForm((prev) => ({
      ...prev,
      date: prev.date || today,
    }));
  }, []);

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      showToast("Harap isi Nama Lengkap dan Nomor WhatsApp Anda terlebih dahulu.", "warning");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer
      id="contact"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 scroll-mt-28 font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* Outer Bento Frame: Signature Dentis Deep Teal (#0D5966) wrapper matching design system */}
      <div className="bg-[#0D5966] p-3 sm:p-4 lg:p-5 rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] shadow-2xl border border-[#0D5966]/20 flex flex-col gap-3 sm:gap-4">
        
        {/* ROW 1: 3 CONTACT CARDS (Email, Telepon, Alamat Klinik) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Card 1: Email */}
          <div className="bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-7 lg:p-8 flex flex-col justify-center border border-slate-100 shadow-xs">
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Email
            </h4>
            <a
              href="mailto:care@dentis.id"
              className="text-sm sm:text-base text-slate-500 hover:text-[#0D5966] font-medium mt-1.5 transition-colors block"
            >
              care@dentis.id
            </a>
          </div>

          {/* Card 2: Telepon & WhatsApp */}
          <div className="bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-7 lg:p-8 flex flex-col justify-center border border-slate-100 shadow-xs">
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Telepon & WhatsApp
            </h4>
            <a
              href="https://wa.me/6282123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base text-slate-500 hover:text-[#0D5966] font-medium mt-1.5 transition-colors block"
            >
              +62 821 2345 6789
            </a>
          </div>

          {/* Card 3: Alamat Klinik */}
          <div className="bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-7 lg:p-8 flex flex-col justify-center border border-slate-100 shadow-xs">
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Alamat Klinik
            </h4>
            <p className="text-sm sm:text-base text-slate-500 font-medium mt-1.5 leading-snug">
              Senopati, Jakarta Selatan
            </p>
          </div>
        </div>

        {/* ROW 2: ASYMMETRIC BENTO GRID (Jam Operasional & Form Reservasi) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* Card 4: Jam Operasional (Left Column ~5 cols) */}
          <div className="lg:col-span-6 bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between border border-slate-100 shadow-xs">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Jam Operasional
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 mb-6 sm:mb-8">
                Jadwalkan Kunjungan Konsultasi Anda
              </p>

              {/* List of 7 Days */}
              <div className="divide-y divide-slate-100">
                {BUSINESS_HOURS.map((item) => (
                  <div
                    key={item.day}
                    className="py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          item.isOpen ? "bg-[#0D5966]" : "bg-slate-300"
                        }`}
                      />
                      <span className="font-semibold text-slate-800">
                        {item.day}
                      </span>
                    </div>
                    <span
                      className={`font-medium ${
                        item.isOpen
                          ? "text-slate-600"
                          : "text-slate-400 font-normal"
                      }`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle trust badge at bottom of business hours */}
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Klinik Beroperasi Hari Ini
              </span>
              <span>Layanan Darurat 24 Jam Siaga</span>
            </div>
          </div>

          {/* Card 5: Form Reservasi Jadwal */}
          <div
            id="booking-form"
            className="lg:col-span-6 bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between border border-slate-100 shadow-xs scroll-mt-28 h-full"
          >
            <div>
              <div className="mb-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Konsultasi & Reservasi Jadwal
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mb-4 sm:mb-6">
                Pilih layanan perawatan dan sesi kunjungan Anda untuk konfirmasi jadwal langsung.
              </p>

              <form onSubmit={handleOpenCheckout} className="space-y-3 sm:space-y-3.5">
                {/* Field 1: Nama Lengkap */}
                <div>
                  <label
                    htmlFor="intake-name"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="intake-name"
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, name: e.target.value })
                    }
                    placeholder="Contoh: Jessica Maharani"
                    className="w-full px-4 py-2.5 sm:py-3 bg-[#FAFAFA] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all"
                  />
                </div>

                {/* Field 2: Nomor WhatsApp */}
                <div>
                  <label
                    htmlFor="intake-phone"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    id="intake-phone"
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, phone: e.target.value })
                    }
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-2.5 sm:py-3 bg-[#FAFAFA] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all"
                  />
                </div>

                {/* Field 3: Pilihan Layanan (Dropdown) */}
                <div>
                  <label
                    htmlFor="intake-service"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Pilihan Layanan
                  </label>
                  <div className="relative">
                    <select
                      id="intake-service"
                      value={bookingForm.service}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, service: e.target.value })
                      }
                      className="w-full px-4 py-2.5 sm:py-3 bg-[#FAFAFA] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all appearance-none cursor-pointer pr-10 font-medium"
                    >
                      <option value="Pemeriksaan Gigi & Konsultasi Dokter">Pemeriksaan Gigi & Konsultasi Dokter</option>
                      <option value="Scaling (Pembersihan Karang)">Scaling (Pembersihan Karang Gigi)</option>
                      <option value="Behel / Aligner Transparan">Behel / Aligner Transparan</option>
                      <option value="Veneer Gigi Porselen">Veneer Gigi Porselen</option>
                      <option value="Whitening (Laser Pemutihan)">Whitening (Pemutihan Gigi Laser)</option>
                      <option value="Tambal / Saluran Saraf">Tambal / Perawatan Saluran Saraf</option>
                      <option value="Implan Gigi Spesialis">Implan Gigi Spesialis</option>
                      <option value="Gigi Anak & Keluarga">Gigi Anak & Keluarga</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Field 4: Keluhan Utama / Catatan Kunjungan */}
                <div>
                  <label
                    htmlFor="intake-notes"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Keluhan Utama / Catatan Kunjungan
                  </label>
                  <input
                    id="intake-notes"
                    type="text"
                    value={bookingForm.notes || ""}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, notes: e.target.value })
                    }
                    placeholder="Contoh: Gigi ngilu, konsultasi behel, scaling..."
                    className="w-full px-4 py-2.5 sm:py-3 bg-[#FAFAFA] border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all"
                  />
                </div>

                {/* Tombol CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#0D5966] hover:bg-[#09414B] text-white font-bold text-sm sm:text-base tracking-wide shadow-md transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Pilih Tanggal & Jam Reservasi</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ROW 3: FOOTER CARD (dentis Brand, Navigasi, Ikuti Kami, Hak Cipta) */}
        <div className="bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-10 lg:p-12 border border-slate-100 shadow-xs flex flex-col justify-between">
          
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 sm:gap-12 pb-8 sm:pb-12 border-b border-slate-200/80">
            
            {/* Kiri: Big Typography "dentis" & Brand Identity */}
            <div className="max-w-md">
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/assets/logo-teal-original.png"
                    alt="dentis logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                  dentis
                </h2>
              </div>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed mt-4 max-w-sm">
                Klinik gigi spesialis dengan dokter terpercaya, perawatan lembut minim rasa sakit, dan suasana privat yang nyaman di Senopati, Jakarta Selatan.
              </p>
            </div>

            {/* Kanan: 2 Kolom Navigasi (Navigasi & Ikuti Kami) */}
            <div className="grid grid-cols-2 gap-6 sm:gap-12 lg:gap-16">
              
              {/* Kolom 1: Navigasi */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-3 sm:mb-4">
                  Navigasi
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 font-medium">
                  <li>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="text-left block hover:text-[#0D5966] transition-colors cursor-pointer"
                    >
                      Beranda
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("about")}
                      className="text-left block hover:text-[#0D5966] transition-colors cursor-pointer"
                    >
                      Tentang Kami
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("services")}
                      className="text-left block hover:text-[#0D5966] transition-colors cursor-pointer"
                    >
                      Layanan Perawatan
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("transformations")}
                      className="text-left block hover:text-[#0D5966] transition-colors cursor-pointer"
                    >
                      Transformasi Senyum
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("doctors")}
                      className="text-left block hover:text-[#0D5966] transition-colors cursor-pointer"
                    >
                      Dokter Spesialis
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo("faq")}
                      className="text-left block hover:text-[#0D5966] transition-colors cursor-pointer"
                    >
                      Tanya Jawab (FAQ)
                    </button>
                  </li>
                </ul>
              </div>

              {/* Kolom 2: Ikuti Kami */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-3 sm:mb-4">
                  Ikuti Kami
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 font-medium">
                  <li>
                    <a
                      href="https://instagram.com/dentis.care"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0D5966] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Instagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/6282123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0D5966] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>WhatsApp</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0D5966] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0D5966] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>TikTok</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0D5966] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>YouTube</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
            <p>© 2026 Dentis Dental Clinic. Seluruh hak cipta dilindungi.</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="hover:text-slate-800 transition-colors cursor-pointer">
                Syarat & Ketentuan
              </span>
              <span>•</span>
              <span className="hover:text-slate-800 transition-colors cursor-pointer">
                Kebijakan Privasi
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Pop-up Modal Reservasi (Booking & Checkout Dialog) */}
      <BookingCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        bookingData={bookingForm}
      />
    </footer>
  );
};
