"use client";

import React, { useState } from "react";
import { useDentalStore } from "@/context/DentalContext";
import { DentalChair, PatientType } from "@/types/dental";
import {
  X,
  UserPlus,
  User,
  Phone,
  Clock,
  Calendar,
  Check,
  Armchair,
} from "lucide-react";

export const AddWalkInModal: React.FC = () => {
  const {
    isWalkInModalOpen,
    closeWalkInModal,
    services,
    doctors,
    addAppointment,
  } = useDentalStore();

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [patientType, setPatientType] = useState<PatientType>("New Patient");
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || "");
  const [chair, setChair] = useState<DentalChair>("Chair 1 (Lounge A)");
  const [timeSlot, setTimeSlot] = useState("Sekarang (Walk-in Langsung)");
  const [notes, setNotes] = useState("");

  if (!isWalkInModalOpen) return null;

  const currentService = services.find((s) => s.id === serviceId) || services[0];
  const currentDoctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) return;

    addAppointment({
      patientName: patientName.trim(),
      phone: phone.trim(),
      patientType,
      serviceId: currentService.id,
      serviceName: currentService.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      date: "Hari Ini, 12 Okt 2026",
      timeSlot,
      status: chair !== "Not Assigned" ? "In Treatment" : "Waiting",
      chair,
      estimatedPrice: currentService.basePrice,
      notes: notes.trim() || "Pasien Walk-in di registrasi resepsionis",
    });

    closeWalkInModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#355D81] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[#C1E55B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Registrasi Pasien Walk-in
              </h3>
              <p className="text-xs text-slate-200">
                Input reservasi langsung meja resepsionis
              </p>
            </div>
          </div>
          <button
            onClick={closeWalkInModal}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Patient Category */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Kategori Pasien
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["New Patient", "Regular Patient"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPatientType(type)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                    patientType === type
                      ? "bg-[#355D81] text-white border-[#355D81]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {type === "New Patient" ? "Pasien Baru" : "Pasien Lama (Regular)"}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Pasien *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Pasien *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pilihan Layanan Tindakan
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] font-medium text-slate-800"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(s.basePrice)})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dokter yang Ditugaskan
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] font-medium text-slate-800"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization} ({d.statusToday})
                </option>
              ))}
            </select>
          </div>

          {/* Dental Chair Assignment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alokasi Dental Chair
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  "Chair 1 (Lounge A)",
                  "Chair 2 (Lounge B)",
                  "Not Assigned",
                ] as const
              ).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChair(ch)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    chair === ch
                      ? "bg-[#355D81] text-white border-[#355D81]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Armchair className="w-4 h-4" />
                  <span className="truncate text-center">
                    {ch.includes("Chair 1")
                      ? "Chair 1"
                      : ch.includes("Chair 2")
                      ? "Chair 2"
                      : "Ruang Tunggu"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Waktu Sesi
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keluhan Pasien (Opsional)
              </label>
              <input
                type="text"
                placeholder="Keluhan singkat..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] font-medium"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={closeWalkInModal}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C1E55B] hover:bg-[#b0d44a] text-[#1E293B] text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#1E293B]" />
              <span>Masukkan ke Antrean Aktif</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
