"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  ArrowLeft,
  Check,
  Tag,
  Copy,
  Sparkles,
  Building2,
  QrCode,
  AlertCircle,
  CreditCard,
  ExternalLink,
} from "lucide-react";

export interface BookingIntakeData {
  name: string;
  phone: string;
  service: string;
  date: string;
  session: string;
  notes?: string;
}

interface BookingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingIntakeData;
}

// 30-minute time slots (per 30 menit)
export interface TimeSlot {
  time: string;
  available: boolean;
}

const ALL_TIME_STRINGS = [
  "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30",
];

// Pola ketersediaan realistis tiap hari agar saat user berganti tanggal, slot jam kosong vs penuh selalu berbeda
const BOOKED_PATTERNS: Record<number, string[]> = {
  0: ["12:00", "13:30", "14:00", "14:30", "17:00", "17:30", "18:00"], // Hari Minggu (persis referensi gambar)
  1: ["11:30", "12:00", "14:00", "15:30", "16:00", "18:00", "20:00"], // Hari Senin
  2: ["11:00", "12:30", "13:00", "14:30", "16:30", "17:00", "19:00"], // Hari Selasa
  3: ["12:00", "13:30", "15:00", "15:30", "17:30", "18:30", "20:30"], // Hari Rabu
  4: ["11:00", "11:30", "13:00", "14:00", "16:00", "18:00", "19:30"], // Hari Kamis
  5: ["12:00", "12:30", "14:00", "14:30", "17:00", "17:30", "19:00"], // Hari Jumat
  6: ["11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"], // Hari Sabtu
};

export const getTimeSlotsForDate = (dateIso: string): TimeSlot[] => {
  if (!dateIso) {
    return ALL_TIME_STRINGS.map((time) => ({ time, available: true }));
  }
  const d = new Date(dateIso);
  const dayIndex = isNaN(d.getDay()) ? 0 : d.getDay();
  const bookedList = BOOKED_PATTERNS[dayIndex] || BOOKED_PATTERNS[0];

  return ALL_TIME_STRINGS.map((time) => ({
    time,
    available: !bookedList.includes(time),
  }));
};

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  isOpen,
  onClose,
  bookingData,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("11:00");
  const [promoCode, setPromoCode] = useState<string>("");
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<
    "qris" | "bca_va" | "mandiri_va" | "clinic"
  >("bca_va");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(899); // 14m 59s timer

  // Initialize date & hour from intake data when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBookingId("");
      setIsProcessing(false);
      setTimeLeft(899);

      // Clean hour from bookingData.session if provided (e.g. "11:00 WIB" -> "11:00")
      const rawHour = bookingData.session || "11:00";
      const match = rawHour.match(/\d{2}:\d{2}/);
      setSelectedHour(match ? match[0] : "11:00");

      if (bookingData.date) {
        setSelectedDate(bookingData.date);
      } else {
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
      }
    }
  }, [isOpen, bookingData]);

  // Countdown timer in payment step
  useEffect(() => {
    if (!isOpen || step !== 2) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step]);

  // Dynamically compute available slots for the active selectedDate
  const currentSlots = React.useMemo(() => {
    return getTimeSlotsForDate(selectedDate);
  }, [selectedDate]);

  // When selectedDate changes, if previously selected hour is not available,
  // automatically update selectedHour to the first available slot!
  useEffect(() => {
    if (!currentSlots.length) return;
    const isCurrentStillAvailable = currentSlots.some(
      (slot) => slot.time === selectedHour && slot.available
    );
    if (!isCurrentStillAvailable) {
      const firstAvail = currentSlots.find((slot) => slot.available);
      if (firstAvail) {
        setSelectedHour(firstAvail.time);
      }
    }
  }, [selectedDate, currentSlots]);

  if (!isOpen) return null;

  // Format IDR Currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const basePrice = 150000;
  const discountAmount = isPromoApplied ? 50000 : 0;
  const totalPrice = Math.max(0, basePrice - discountAmount);

  // Generate 7 upcoming dates for interactive "kotak-kotak" calendar
  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("id-ID", { weekday: "short" });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString("id-ID", { month: "short" });
    const fullDate = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return {
      iso,
      dayName,
      dayNumber,
      monthName,
      label: `${dayName}, ${fullDate}`,
      fullLabel: d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  });

  const getActiveDateDisplay = () => {
    const found = upcomingDates.find((item) => item.iso === selectedDate);
    if (found) return found.fullLabel;
    try {
      const d = new Date(selectedDate);
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return selectedDate;
    }
  };

  const getActiveShortDate = () => {
    const found = upcomingDates.find((item) => item.iso === selectedDate);
    if (found) return `${found.dayName}, ${found.dayNumber} ${found.monthName}`;
    try {
      const d = new Date(selectedDate);
      return d.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch {
      return selectedDate;
    }
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (code === "DENTISBARU") {
      setIsPromoApplied(true);
      setPromoError("");
    } else {
      setIsPromoApplied(false);
      setPromoError("Kode voucher tidak valid. Coba masukkan 'DENTISBARU'.");
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `#DNT-2026-${randomCode}`;
      setBookingId(generatedId);
      setIsProcessing(false);
      setStep(3);

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#0D5966", "#2DD4BF", "#14B8A6", "#042F2E", "#F59E0B"],
        });
      } catch {
        // fallback
      }
    }, 850);
  };

  // Timer format (mm:ss)
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  // Payment method human readable label
  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case "bca_va":
        return "BCA Virtual Account";
      case "mandiri_va":
        return "Mandiri Virtual Account";
      case "qris":
        return "QRIS Instant Settlement";
      case "clinic":
        return "Bayar di Kasir Klinik (Bebas DP)";
    }
  };

  // WhatsApp formatted confirmation text
  const waConfirmMessage = encodeURIComponent(
    `Halo Dentis, saya telah menyelesaikan reservasi jadwal perawatan online.\n\n` +
      `*Detail Reservasi Pasien:*\n` +
      `• ID Booking: ${bookingId || "#DNT-2026-PENDING"}\n` +
      `• Nama Pasien: ${bookingData.name}\n` +
      `• No. WhatsApp: ${bookingData.phone}\n` +
      `• Layanan: ${bookingData.service}\n` +
      (bookingData.notes ? `• Keluhan / Catatan: ${bookingData.notes}\n` : "") +
      `• Jadwal Sesi: ${getActiveDateDisplay()} • Pukul ${selectedHour} WIB\n` +
      `• Metode Pembayaran: ${getPaymentLabel()}\n` +
      `• Status: ${paymentMethod === "clinic" ? "Terkonfirmasi (Bayar di Klinik)" : "Lunas Terverifikasi"}\n\n` +
      `Mohon dibantu reminder jadwal dan arahan saat kedatangan di klinik. Terima kasih!`
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-['Bricolage_Grotesque',sans-serif]">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-[24px] sm:rounded-[28px] border border-[#0D5966]/20 shadow-2xl p-4 sm:p-6 my-auto overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        {/* Header with Step indicator & Close button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <span
                className={`h-1.5 rounded-full transition-all ${
                  step >= 1 ? "w-6 bg-[#0D5966]" : "w-2 bg-slate-200"
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all ${
                  step >= 2 ? "w-6 bg-[#0D5966]" : "w-2 bg-slate-200"
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all ${
                  step >= 3 ? "w-6 bg-emerald-500" : "w-2 bg-slate-200"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {step === 1 && "Langkah 1: Pilih Jadwal"}
              {step === 2 && "Langkah 2: Pembayaran"}
              {step === 3 && "Langkah 3: Tiket Selesai"}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container Body */}
        <div className="overflow-y-auto pr-1 -mr-1 flex-1">
          {/* ============================================================== */}
          {/* STEP 1: PILIH TANGGAL & SESI JAM */}
          {/* ============================================================== */}
          {step === 1 && (
            <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-150">
              {/* Header Title */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  Konfirmasi Jadwal Sesi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih tanggal dan sesi jam dokter yang masih tersedia.
                </p>
              </div>

              {/* Data Pasien Mini Bar */}
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-900 leading-snug">
                    {bookingData.name}{" "}
                    <span className="text-slate-400 font-normal">
                      • {bookingData.phone}
                    </span>
                  </p>
                  <p className="text-[11px] text-[#0D5966] font-semibold mt-0.5 truncate">
                    {bookingData.service}
                  </p>
                </div>
              </div>

              {/* SECTION: PILIH TANGGAL SESI */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Pilih Tanggal Sesi
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {getActiveDateDisplay()}
                  </span>
                </div>

                {/* 7-Day Strip */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {upcomingDates.map((item) => {
                    const isSelected = selectedDate === item.iso;
                    return (
                      <button
                        key={item.iso}
                        type="button"
                        onClick={() => setSelectedDate(item.iso)}
                        className={`py-2 px-0.5 sm:py-2.5 sm:px-1 rounded-xl text-center transition-all duration-150 flex flex-col items-center justify-center cursor-pointer select-none border ${
                          isSelected
                            ? "bg-[#0D5966] text-white border-[#0D5966] shadow-xs ring-2 ring-[#0D5966]/20"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${
                            isSelected ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          {item.dayName}
                        </span>
                        <span
                          className={`text-sm sm:text-base font-extrabold my-0.5 leading-none ${
                            isSelected ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {item.dayNumber}
                        </span>
                        <span
                          className={`text-[9px] font-medium capitalize ${
                            isSelected ? "text-white/80" : "text-slate-400"
                          }`}
                        >
                          {item.monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: JAM YANG TERSEDIA (WIB) - CLEAN PILLS, ZERO AI SLOP */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Jam Sesi Dokter (WIB)
                  </span>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#0D5966]" />
                      <span>Terpilih</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      <span>Penuh</span>
                    </span>
                  </div>
                </div>

                {/* Grid 4 Kolom: Pills Bersih Tanpa Teks Merah & Tanpa Label AI Slop */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {currentSlots.map((slot) => {
                    const isSelected = selectedHour === slot.time && slot.available;
                    const isAvailable = slot.available;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedHour(slot.time)}
                        className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all duration-150 select-none border ${
                          !isAvailable
                            ? "bg-slate-50 border-slate-100 text-slate-300 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-[#0D5966] text-white border-[#0D5966] shadow-xs ring-2 ring-[#0D5966]/20"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-[#0D5966]/40 cursor-pointer"
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar: Ringkasan Jadwal & Lanjut */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Jadwal Terpilih
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight whitespace-nowrap">
                    {getActiveShortDate()} • {selectedHour} WIB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-5 sm:px-6 rounded-full bg-[#0D5966] hover:bg-[#09414B] text-white font-bold text-xs sm:text-sm shadow-md transition-colors duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap group"
                >
                  <span>Lanjut</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: METODE PEMBAYARAN & KODE DUMMY REALISTIS */}
          {/* ============================================================== */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
              {/* Header Title & Timer */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                    Pilih Metode Pembayaran
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selesaikan reservasi dengan transfer otomatis atau bayar di kasir.
                  </p>
                </div>
                {/* Live Countdown Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>
              </div>

              {/* Ringkasan Jadwal yang Dipilih */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-[#0D5966]" />
                  <span className="font-semibold">{getActiveDateDisplay()}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-[#0D5966]">{selectedHour} WIB</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#0D5966] font-bold hover:underline text-[11px] cursor-pointer"
                >
                  Ubah
                </button>
              </div>

              {/* Selector 4 Opsi Pembayaran Realistis */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {/* 1. BCA Virtual Account */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bca_va")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "bca_va"
                      ? "border-[#0D5966] bg-[#0D5966]/5 ring-1 ring-[#0D5966]"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-blue-700 text-xs tracking-wider">
                      BCA VA
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === "bca_va"
                          ? "border-[#0D5966] bg-[#0D5966]"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "bca_va" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">BCA Virtual Account</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Verifikasi Otomatis</p>
                </button>

                {/* 2. Mandiri Virtual Account */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mandiri_va")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "mandiri_va"
                      ? "border-[#0D5966] bg-[#0D5966]/5 ring-1 ring-[#0D5966]"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-amber-600 text-xs tracking-wider">
                      MANDIRI VA
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === "mandiri_va"
                          ? "border-[#0D5966] bg-[#0D5966]"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "mandiri_va" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">Mandiri Virtual Account</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Livin&apos; by Mandiri</p>
                </button>

                {/* 3. QRIS Instant */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("qris")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "qris"
                      ? "border-[#0D5966] bg-[#0D5966]/5 ring-1 ring-[#0D5966]"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-slate-800 text-xs tracking-wider">
                      QRIS
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === "qris"
                          ? "border-[#0D5966] bg-[#0D5966]"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "qris" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">QRIS Instan</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Gopay, OVO, ShopeePay</p>
                </button>

                {/* 4. Bayar di Klinik */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("clinic")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "clinic"
                      ? "border-[#0D5966] bg-[#0D5966]/5 ring-1 ring-[#0D5966]"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-emerald-700 text-xs tracking-wider">
                      KASIR
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === "clinic"
                          ? "border-[#0D5966] bg-[#0D5966]"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "clinic" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">Bayar di Klinik</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Bebas DP</p>
                </button>
              </div>

              {/* TAMPILAN DETAIL KODE DUMMY SESUAI METODE YANG DIPILIH */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                {/* 1. Tampilan Kode Dummy BCA VA */}
                {paymentMethod === "bca_va" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Nomor Virtual Account BCA
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        BCA Online
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                      <div>
                        <p className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wider">
                          8214 0821 2345 6789
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Atas Nama: <span className="font-bold text-slate-700">DENTIS - {bookingData.name.toUpperCase()}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText("8214082123456789", "bca_va")}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0D5966] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedField === "bca_va" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Total Nominal Pembayaran:</span>
                      <span className="font-black text-sm text-[#0D5966]">
                        {formatIDR(totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Tampilan Kode Dummy Mandiri VA */}
                {paymentMethod === "mandiri_va" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Nomor Mandiri Virtual Account
                      </span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Livin&apos; by Mandiri
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                      <div>
                        <p className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wider">
                          88708 0821 2345 678
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Atas Nama: <span className="font-bold text-slate-700">DENTIS CLINIC</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText("8870808212345678", "mandiri_va")}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0D5966] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedField === "mandiri_va" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Total Tagihan:</span>
                      <span className="font-black text-sm text-[#0D5966]">
                        {formatIDR(totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Tampilan Kode Dummy QRIS */}
                {paymentMethod === "qris" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black tracking-widest text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                        QRIS RESMI
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Dentis Clinic Senopati
                      </span>
                    </div>

                    {/* Visual QR Code Mock */}
                    <div className="w-36 h-36 bg-white border-2 border-slate-900 rounded-xl p-2 flex flex-col items-center justify-between shadow-xs">
                      <div className="w-full flex justify-between">
                        <div className="w-7 h-7 border-4 border-slate-900 rounded-xs flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-xs" />
                        </div>
                        <div className="w-7 h-7 border-4 border-slate-900 rounded-xs flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1 p-1">
                        <div className="w-2 h-2 bg-slate-900 rounded-xs" />
                        <div className="w-2 h-2 bg-[#0D5966] rounded-xs" />
                        <div className="w-2 h-2 bg-slate-900 rounded-xs" />
                        <div className="w-2 h-2 bg-slate-900 rounded-xs" />
                        <div className="w-2 h-2 bg-[#0D5966] rounded-xs" />
                        <div className="w-2 h-2 bg-slate-900 rounded-xs" />
                        <div className="w-2 h-2 bg-[#0D5966] rounded-xs" />
                        <div className="w-2 h-2 bg-slate-900 rounded-xs" />
                      </div>
                      <div className="w-full flex justify-between items-end">
                        <div className="w-7 h-7 border-4 border-slate-900 rounded-xs flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-xs" />
                        </div>
                        <span className="text-[9px] font-black text-[#0D5966]">NMID: ID1020261984729</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <p className="text-xs font-bold text-slate-800">
                        Scan via BCA, Mandiri, GoPay, OVO, ShopeePay
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Total Pembayaran:{" "}
                        <span className="font-extrabold text-[#0D5966]">
                          {formatIDR(totalPrice)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. Tampilan Bayar di Klinik */}
                {paymentMethod === "clinic" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold">
                        Bebas Biaya Online • Bayar Saat Kunjungan Selesai
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Estimasi Biaya di Kasir:</span>
                        <span className="font-bold text-slate-800">{formatIDR(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Metode Kasir:</span>
                        <span className="font-medium text-slate-700">Debit, Kredit, QRIS, Asuransi</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        Tunjukkan kode tiket kepada resepsionis saat tiba di klinik Dentis.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Voucher Promo */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      placeholder="Kode voucher promo (DENTISBARU)"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 uppercase tracking-wider focus:outline-none focus:border-[#0D5966]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 hover:bg-[#0D5966] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Terapkan
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
                )}
                {isPromoApplied && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Voucher aktif! Potongan Rp50.000 berhasil diterapkan.
                  </p>
                )}
              </form>

              {/* Rincian Biaya */}
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1.5 bg-[#FAFAFA] text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Reservasi & Konsultasi Spesialis</span>
                  <span className="font-semibold text-slate-800">{formatIDR(basePrice)}</span>
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Voucher DENTISBARU
                    </span>
                    <span>- {formatIDR(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline font-bold">
                  <span className="text-slate-900">Total Biaya Komitmen</span>
                  <span className="text-base sm:text-lg text-[#0D5966]">
                    {formatIDR(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Kembali & Konfirmasi Reservasi */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-3.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="flex-1 py-3 px-4 rounded-full bg-[#0D5966] hover:bg-[#09414B] text-white font-bold text-xs sm:text-sm shadow-md transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 whitespace-nowrap group"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Konfirmasi Reservasi</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: SUCCESS TICKET DENGAN CTA WHATSAPP LENGKAP */}
          {/* ============================================================== */}
          {step === 3 && (
            <div className="text-center py-2 space-y-4 animate-in zoom-in-95 duration-200">
              {/* Checkmark Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 stroke-[2.2]" />
              </div>

              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                  {paymentMethod === "clinic" ? "Terkonfirmasi (Bayar di Klinik)" : "Pembayaran Terverifikasi"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Reservasi Jadwal Berhasil!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
                  Terima kasih, <strong>{bookingData.name}</strong>. Tim spesialis Dentis siap menyambut kunjungan Anda.
                </p>
              </div>

              {/* Kartu Tiket Reservasi Resmi */}
              <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-slate-200 text-left space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs text-slate-500 font-medium">Nomor ID Reservasi</span>
                  <span className="text-base font-black text-[#0D5966] tracking-wider font-mono">
                    {bookingId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Layanan</span>
                    <span className="font-bold text-slate-800">{bookingData.service}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Metode Bayar</span>
                    <span className="font-bold text-slate-800">
                      {paymentMethod === "clinic" ? "Bayar di Kasir" : "Lunas Terverifikasi"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tanggal</span>
                    <span className="font-bold text-slate-800">{getActiveDateDisplay()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Sesi Jam</span>
                    <span className="font-extrabold text-[#0D5966]">{selectedHour} WIB</span>
                  </div>
                  {bookingData.notes && (
                    <div className="col-span-2 pt-1 border-t border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Catatan Kunjungan</span>
                      <span className="font-medium text-slate-700">{bookingData.notes}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                  Lokasi: <strong>Dentis Clinic Senopati</strong> (Jl. Senopati No. 42, Jaksel). Harap hadir 10 menit sebelum pukul {selectedHour} WIB.
                </div>
              </div>

              {/* CTA WHATSAPP UTAMA (BERSIH & RINGKAS) */}
              <div className="space-y-2 pt-1">
                <a
                  href={`https://wa.me/6282123456789?text=${waConfirmMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full bg-[#0D5966] hover:bg-[#09414B] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Konfirmasi via WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors duration-150 cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
