"use client";

import React, { useState, useEffect } from "react";
import { useDentalStore } from "@/context/DentalContext";
import confetti from "canvas-confetti";
import {
  X,
  Check,
  Calendar,
  Clock,
  User,
  Phone,
  ArrowUpRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    services,
    doctors,
    preselectedServiceId,
    preselectedDoctorId,
    addAppointment,
  } = useDentalStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("Hari Ini, 12 Okt 2026");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:30 - 11:15");
  const [patientName, setPatientName] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [patientType, setPatientType] = useState<"New Patient" | "Regular Patient">("New Patient");
  const [notes, setNotes] = useState<string>("");
  const [confirmedId, setConfirmedId] = useState<string>("");

  useEffect(() => {
    if (isBookingModalOpen) {
      setStep(1);
      setSelectedServiceId(preselectedServiceId || services[0]?.id || "");
      setSelectedDoctorId(preselectedDoctorId || doctors[0]?.id || "");
      setConfirmedId("");
    }
  }, [isBookingModalOpen, preselectedServiceId, preselectedDoctorId, services, doctors]);

  if (!isBookingModalOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const dateOptions = [
    { label: "Hari Ini", date: "Hari Ini, 12 Okt 2026", slotsLeft: "3 slot" },
    { label: "Besok", date: "Selasa, 13 Okt 2026", slotsLeft: "6 slot" },
    { label: "Lusa", date: "Rabu, 14 Okt 2026", slotsLeft: "8 slot" },
    { label: "Kamis", date: "Kamis, 15 Okt 2026", slotsLeft: "5 slot" },
  ];

  const timeSlots = [
    "09:00 - 09:45",
    "10:30 - 11:15",
    "11:45 - 12:30",
    "13:30 - 14:15",
    "15:00 - 15:45",
    "16:30 - 17:15",
    "18:30 - 19:15",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !whatsapp.trim()) return;

    const newAppt = addAppointment({
      patientName: patientName.trim(),
      phone: whatsapp.trim(),
      patientType,
      serviceId: currentService.id,
      serviceName: currentService.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      status: "Waiting",
      chair: "Not Assigned",
      estimatedPrice: currentService.basePrice,
      notes: notes.trim() || undefined,
    });

    setConfirmedId(newAppt.id);
    setStep(4);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0D5966", "#187a8c", "#F3F5F4"],
      });
    } catch {}
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl sm:rounded-[2rem] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4.5 bg-[#0D5966] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                Reservasi Jadwal Konsultasi
              </h3>
              <p className="text-xs text-white/80">
                Pendaftaran instan tanpa antrean manual
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        {step !== 4 && (
          <div className="px-6 pt-4 pb-2 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className={step >= 1 ? "text-[#0D5966] font-bold" : ""}>
                1. Layanan & Dokter
              </span>
              <span className={step >= 2 ? "text-[#0D5966] font-bold" : ""}>
                2. Waktu Kunjungan
              </span>
              <span className={step >= 3 ? "text-[#0D5966] font-bold" : ""}>
                3. Identitas Pasien
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#F3F5F4] rounded-full overflow-hidden flex">
              <div
                className="bg-[#0D5966] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Select Service & Doctor */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Pilih Layanan Dental
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map((srv) => {
                    const isSelected = srv.id === selectedServiceId;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#0D5966] bg-[#0D5966]/5 ring-2 ring-[#0D5966]/20"
                            : "border-slate-200/90 hover:bg-[#F3F5F4]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">
                            {srv.name}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#0D5966] flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#0D5966] font-semibold">
                          Mulai {formatIDR(srv.basePrice)} • ~{srv.durationMinutes} mnt
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Pilih Dokter Spesialis
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {doctors.map((doc) => {
                    const isSelected = doc.id === selectedDoctorId;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? "border-[#0D5966] bg-[#0D5966]/5 ring-2 ring-[#0D5966]/20"
                            : "border-slate-200/90 hover:bg-[#F3F5F4]"
                        }`}
                      >
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {doc.specialization}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            ● {doc.statusToday}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Time Slot */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Pilih Tanggal Kunjungan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {dateOptions.map((opt) => {
                    const isSelected = selectedDate === opt.date;
                    return (
                      <button
                        key={opt.date}
                        type="button"
                        onClick={() => setSelectedDate(opt.date)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#0D5966] bg-[#0D5966] text-white shadow-xs"
                            : "border-slate-200 bg-white hover:bg-[#F3F5F4] text-slate-700"
                        }`}
                      >
                        <p className="text-xs font-bold">{opt.label}</p>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            isSelected ? "text-white/80" : "text-slate-500"
                          }`}
                        >
                          {opt.date.split(",")[1]}
                        </p>
                        <span
                          className={`inline-block text-[9px] px-2 py-0.5 rounded-full mt-1.5 font-semibold ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[#F3F5F4] text-slate-600"
                          }`}
                        >
                          {opt.slotsLeft}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Pilih Jam Sesi Perawatan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-3 px-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isSelected
                            ? "border-[#0D5966] bg-[#0D5966]/10 text-[#0D5966] ring-2 ring-[#0D5966]/30"
                            : "border-slate-200 text-slate-700 hover:bg-[#F3F5F4]"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 opacity-60" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-[#F3F5F4] rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0D5966] shrink-0" />
                <span>
                  Slot waktu ini akan langsung direservasi khusus untuk Anda di dental
                  chair bersterilisasi penuh.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Name & WhatsApp Number */}
          {step === 3 && (
            <form onSubmit={handleSubmit} id="booking-form" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Status Pasien
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["New Patient", "Regular Patient"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPatientType(type)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        patientType === type
                          ? "bg-[#0D5966] text-white border-[#0D5966]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-[#F3F5F4]"
                      }`}
                    >
                      {type === "New Patient"
                        ? "Pasien Baru (New Patient)"
                        : "Pasien Lama (Regular)"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap Pasien *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jessica Saraswati"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D5966] text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor WhatsApp Aktif *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="0812-XXXX-XXXX"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D5966] text-slate-800 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Konfirmasi barcode dan pengingat jadwal akan dikirim via WhatsApp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Keluhan / Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Gigi belakang kanan agak ngilu saat minum dingin..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D5966] text-slate-800 font-medium resize-none"
                />
              </div>

              {/* Order Summary Recap Box */}
              <div className="p-4 bg-[#F3F5F4] rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Layanan:</span>
                  <span className="font-bold text-slate-800">
                    {currentService?.name}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Dokter:</span>
                  <span className="font-bold text-slate-800">
                    {currentDoctor?.name}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Waktu:</span>
                  <span className="font-bold text-[#0D5966]">
                    {selectedDate} • {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1.5 border-t border-slate-200">
                  <span>Estimasi Biaya:</span>
                  <span className="font-black text-[#0D5966]">
                    Mulai {formatIDR(currentService?.basePrice || 0)}
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div className="text-center py-6 px-2 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-[#0D5966]/15 flex items-center justify-center mx-auto text-[#0D5966]">
                <CheckCircle2 className="w-10 h-10 text-[#0D5966]" />
              </div>

              <div>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  Janji Temu Berhasil Dibuat
                </span>
                <h3 className="text-2xl font-black text-[#0D5966]">
                  Terima Kasih, {patientName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  Jadwal Anda telah tercatat pada sistem klinik dentis.
                  Petugas resepsionis kami siap menyambut kedatangan Anda.
                </p>
              </div>

              {/* Digital Booking Ticket Pass */}
              <div className="bg-[#F3F5F4] border border-slate-200/90 rounded-2xl p-5 max-w-md mx-auto text-left shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Kode Reservasi
                    </span>
                    <div className="text-lg font-black text-[#0D5966]">
                      {confirmedId}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Status Reservasi
                    </span>
                    <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Terkonfirmasi
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tindakan:</span>
                    <span className="font-bold text-slate-800 line-clamp-1">
                      {currentService?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dokter:</span>
                    <span className="font-bold text-slate-800 line-clamp-1">
                      {currentDoctor?.name}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Waktu:</span>
                    <span className="font-bold text-[#0D5966]">
                      {selectedDate} ({selectedTimeSlot})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 max-w-md mx-auto">
                <button
                  onClick={closeBookingModal}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0D5966] hover:bg-[#083d47] text-white font-bold text-sm cursor-pointer transition-colors shadow-md"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        {step !== 4 && (
          <div className="px-6 py-4 bg-[#F3F5F4] border-t border-slate-200/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="group inline-flex items-center gap-2 bg-[#0D5966] hover:bg-[#09414B] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs text-xs sm:text-sm cursor-pointer transition-colors duration-200"
              >
                <span>Lanjutkan</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            ) : (
              <button
                type="submit"
                form="booking-form"
                className="inline-flex items-center gap-2 bg-[#0D5966] hover:bg-[#083d47] text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Konfirmasi Reservasi</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
