"use client";

import React, { useState } from "react";
import { useDentalStore } from "@/context/DentalContext";
import { ToothCondition, ToothState } from "@/types/dental";
import {
  Activity,
  Save,
  RotateCcw,
  User,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export const OdontogramChart: React.FC = () => {
  const {
    activePatientOdontogram,
    setActivePatientForOdontogram,
    updateTooth,
    updateClinicalNotes,
    resetOdontogram,
    appointments,
    showToast,
  } = useDentalStore();

  const [selectedToothNum, setSelectedToothNum] = useState<number>(26);
  const [editingNote, setEditingNote] = useState<string>("");

  const currentToothState: ToothState = activePatientOdontogram.teeth[
    selectedToothNum
  ] || {
    fdiNumber: selectedToothNum,
    condition: "Healthy",
  };

  const conditionsMap: Record<
    ToothCondition,
    {
      condition: ToothCondition;
      label: string;
      color: string;
      badgeBg: string;
      borderColor: string;
    }
  > = {
    Healthy: {
      condition: "Healthy",
      label: "Sehat (Healthy)",
      color: "bg-emerald-500",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      borderColor: "border-emerald-300",
    },
    Caries: {
      condition: "Caries",
      label: "Karies (Berlubang)",
      color: "bg-red-500",
      badgeBg: "bg-red-50 text-red-700 border-red-200",
      borderColor: "border-red-400",
    },
    Filling: {
      condition: "Filling",
      label: "Tambalan (Restorasi)",
      color: "bg-[#355D81]",
      badgeBg: "bg-blue-50 text-[#355D81] border-blue-200",
      borderColor: "border-[#355D81]",
    },
    Extraction: {
      condition: "Extraction",
      label: "Dicabut / Hilang",
      color: "bg-slate-400",
      badgeBg: "bg-slate-100 text-slate-700 border-slate-300",
      borderColor: "border-slate-400",
    },
    "Crown/Veneer": {
      condition: "Crown/Veneer",
      label: "Crown / Veneer",
      color: "bg-amber-400",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      borderColor: "border-amber-400",
    },
  };

  const activeConditionInfo = conditionsMap[currentToothState.condition] || conditionsMap.Healthy;

  // Helper to get tooth style based on condition
  const getToothVisual = (fdiNumber: number) => {
    const state = activePatientOdontogram.teeth[fdiNumber];
    const condition = state?.condition || "Healthy";

    switch (condition) {
      case "Caries":
        return {
          bg: "bg-red-100 text-red-700 border-red-400 shadow-xs",
          label: "C",
          iconColor: "#ef4444",
        };
      case "Filling":
        return {
          bg: "bg-[#355D81]/20 text-[#355D81] border-[#355D81] shadow-xs font-bold",
          label: "F",
          iconColor: "#355D81",
        };
      case "Extraction":
        return {
          bg: "bg-slate-100 text-slate-400 border-slate-300 line-through opacity-60",
          label: "X",
          iconColor: "#94a3b8",
        };
      case "Crown/Veneer":
        return {
          bg: "bg-[#C1E55B]/40 text-emerald-900 border-[#C1E55B] font-bold",
          label: "V",
          iconColor: "#84cc16",
        };
      default:
        return {
          bg: "bg-white text-slate-700 border-slate-200/90 hover:border-slate-400",
          label: "",
          iconColor: "#64748b",
        };
    }
  };

  const handleToothSelect = (num: number) => {
    setSelectedToothNum(num);
    const existing = activePatientOdontogram.teeth[num];
    setEditingNote(existing?.note || "");
  };

  const handleConditionChange = (cond: ToothCondition) => {
    updateTooth(selectedToothNum, cond, editingNote);
  };

  const handleSaveNote = () => {
    updateTooth(selectedToothNum, currentToothState.condition, editingNote);
    showToast(`Catatan gigi FDI ${selectedToothNum} berhasil disimpan!`, "success");
  };

  // Quadrants
  const q1 = [18, 17, 16, 15, 14, 13, 12, 11]; // Maxillary Right
  const q2 = [21, 22, 23, 24, 25, 26, 27, 28]; // Maxillary Left
  const q4 = [48, 47, 46, 45, 44, 43, 42, 41]; // Mandibular Right
  const q3 = [31, 32, 33, 34, 35, 36, 37, 38]; // Mandibular Left

  // Counts
  const counts = Object.values(activePatientOdontogram.teeth).reduce(
    (acc, t) => {
      acc[t.condition] = (acc[t.condition] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Top Bar: Patient Selector & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#355D81]" />
            <h3 className="text-xl font-black text-[#1E293B]">
              Mini Odontogram & Clinical Chart (FDI Standard)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagram odontogram interaktif 32 gigi dewasa berstandar FDI World Dental Federation
          </p>
        </div>

        {/* Patient Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <User className="w-4 h-4 text-[#355D81]" />
            <span className="text-xs text-slate-500 font-semibold">Pasien:</span>
            <select
              value={activePatientOdontogram.patientName}
              onChange={(e) => setActivePatientForOdontogram(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {appointments.map((a) => (
                <option key={a.id} value={a.patientName}>
                  {a.patientName} ({a.serviceName.slice(0, 16)}...)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetOdontogram}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Reset Odontogram ke Gigi Sehat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend & Stats Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400 mr-1">Legenda:</span>
          <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Sehat ({32 - (counts.Caries || 0) - (counts.Filling || 0) - (counts.Extraction || 0) - (counts["Crown/Veneer"] || 0)})
          </span>
          <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Karies ({counts.Caries || 0})
          </span>
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg text-[#355D81]">
            <span className="w-2 h-2 rounded-full bg-[#355D81]" />
            Tambalan ({counts.Filling || 0})
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg text-slate-600">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Dicabut ({counts.Extraction || 0})
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Crown/Veneer ({counts["Crown/Veneer"] || 0})
          </span>
        </div>

        <div className="text-xs text-[#355D81] font-bold flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>Klik elemen gigi untuk ubah status</span>
        </div>
      </div>

      {/* Visual Dental Arch Odontogram Grid */}
      <div className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-200/80">
        {/* UPPER JAW (Maxilla) */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2">
            <span>Rahang Atas Kanan (Q1)</span>
            <span className="text-slate-500 font-extrabold text-[11px] bg-white px-2 py-0.5 rounded-md border border-slate-200">
              MAXILLARY ARCH (ATAS)
            </span>
            <span>Rahang Atas Kiri (Q2)</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Q1: 18 -> 11 */}
            <div className="flex justify-end gap-1.5 sm:gap-2">
              {q1.map((num) => {
                const isSelected = selectedToothNum === num;
                const visual = getToothVisual(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleToothSelect(num)}
                    className={`relative w-8 sm:w-11 h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                      visual.bg
                    } ${
                      isSelected
                        ? "ring-2 ring-[#355D81] scale-105 z-10 shadow-md !border-[#355D81]"
                        : ""
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400">
                      {num}
                    </span>
                    <div className="w-4 h-4 flex items-center justify-center font-black text-xs">
                      {visual.label}
                    </div>
                    {/* Visual tooth root marker */}
                    <div className="w-2 h-1 bg-current opacity-30 rounded-full" />
                  </button>
                );
              })}
            </div>

            {/* Q2: 21 -> 28 */}
            <div className="flex justify-start gap-1.5 sm:gap-2">
              {q2.map((num) => {
                const isSelected = selectedToothNum === num;
                const visual = getToothVisual(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleToothSelect(num)}
                    className={`relative w-8 sm:w-11 h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                      visual.bg
                    } ${
                      isSelected
                        ? "ring-2 ring-[#355D81] scale-105 z-10 shadow-md !border-[#355D81]"
                        : ""
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400">
                      {num}
                    </span>
                    <div className="w-4 h-4 flex items-center justify-center font-black text-xs">
                      {visual.label}
                    </div>
                    <div className="w-2 h-1 bg-current opacity-30 rounded-full" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Arch divider line */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-slate-300" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400">
            <span className="bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
              Garis Oklusal Tengah (Centerline)
            </span>
          </div>
        </div>

        {/* LOWER JAW (Mandible) */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            {/* Q4: 48 -> 41 */}
            <div className="flex justify-end gap-1.5 sm:gap-2">
              {q4.map((num) => {
                const isSelected = selectedToothNum === num;
                const visual = getToothVisual(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleToothSelect(num)}
                    className={`relative w-8 sm:w-11 h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                      visual.bg
                    } ${
                      isSelected
                        ? "ring-2 ring-[#355D81] scale-105 z-10 shadow-md !border-[#355D81]"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-1 bg-current opacity-30 rounded-full" />
                    <div className="w-4 h-4 flex items-center justify-center font-black text-xs">
                      {visual.label}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {num}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Q3: 31 -> 38 */}
            <div className="flex justify-start gap-1.5 sm:gap-2">
              {q3.map((num) => {
                const isSelected = selectedToothNum === num;
                const visual = getToothVisual(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleToothSelect(num)}
                    className={`relative w-8 sm:w-11 h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                      visual.bg
                    } ${
                      isSelected
                        ? "ring-2 ring-[#355D81] scale-105 z-10 shadow-md !border-[#355D81]"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-1 bg-current opacity-30 rounded-full" />
                    <div className="w-4 h-4 flex items-center justify-center font-black text-xs">
                      {visual.label}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {num}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mt-2.5 px-2">
            <span>Rahang Bawah Kanan (Q4)</span>
            <span className="text-slate-500 font-extrabold text-[11px] bg-white px-2 py-0.5 rounded-md border border-slate-200">
              MANDIBULAR ARCH (BAWAH)
            </span>
            <span>Rahang Bawah Kiri (Q3)</span>
          </div>
        </div>
      </div>

      {/* Selected Tooth Editor Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Left: Quick Condition Selector for Selected Tooth */}
        <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Elemen Terpilih:
              </span>
              <div className="text-lg font-black text-[#1E293B]">
                Gigi FDI #{selectedToothNum}{" "}
                <span className="text-xs font-semibold text-slate-500">
                  ({selectedToothNum <= 28 ? "Rahang Atas" : "Rahang Bawah"})
                </span>
              </div>
            </div>

            <div
              className={`text-xs font-bold px-3 py-1 rounded-xl border ${activeConditionInfo.badgeBg}`}
            >
              Status: {activeConditionInfo.label}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              Ubah Kondisi Gigi:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  "Healthy",
                  "Caries",
                  "Filling",
                  "Extraction",
                  "Crown/Veneer",
                ] as ToothCondition[]
              ).map((cond) => (
                <button
                  key={cond}
                  onClick={() => handleConditionChange(cond)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    currentToothState.condition === cond
                      ? "bg-[#355D81] text-white border-[#355D81] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cond === "Healthy"
                    ? "Sehat"
                    : cond === "Caries"
                    ? "Karies"
                    : cond === "Filling"
                    ? "Tambalan"
                    : cond === "Extraction"
                    ? "Dicabut"
                    : "Crown / Veneer"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Catatan Spesifik Gigi #{selectedToothNum}:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Misal: Karies servikal, tambal komposit kelas II..."
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] text-slate-800"
              />
              <button
                onClick={handleSaveNote}
                className="px-3.5 py-2 bg-[#355D81] hover:bg-[#264460] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>

        {/* Right: General Clinical Notes Area */}
        <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Catatan Diagnosa & Rencana Klinis Pasien
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Tersimpan di Rekam Medis
              </span>
            </div>

            <textarea
              rows={4}
              value={activePatientOdontogram.clinicalNotes}
              onChange={(e) => updateClinicalNotes(e.target.value)}
              placeholder="Catatan kondisi gingiva, oklusi, rekomendasi perawatan berikutnya..."
              className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] text-slate-800 resize-none font-medium leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() =>
                showToast(
                  `Rekam medis odontogram untuk ${activePatientOdontogram.patientName} tersimpan!`,
                  "success"
                )
              }
              className="inline-flex items-center gap-1.5 bg-[#C1E55B] hover:bg-[#b0d44a] text-[#1E293B] font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4 text-[#1E293B]" />
              <span>Simpan Rekam Medis Odontogram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
