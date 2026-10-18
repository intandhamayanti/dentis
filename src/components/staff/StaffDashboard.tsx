"use client";

import React, { useState } from "react";
import { useDentalStore } from "@/context/DentalContext";
import { AppointmentStatus, DentalChair } from "@/types/dental";
import { OdontogramChart } from "./OdontogramChart";
import { CmsConfigPanel } from "./CmsConfigPanel";
import { AddWalkInModal } from "./AddWalkInModal";
import {
  Users,
  Clock,
  Armchair,
  CheckCircle,
  Search,
  Filter,
  UserPlus,
  Phone,
  Calendar,
  AlertCircle,
  Check,
  X,
  Play,
  RotateCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Activity,
  SlidersHorizontal,
} from "lucide-react";

export const StaffDashboard: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    assignChair,
    deleteAppointment,
    openWalkInModal,
    setActivePatientForOdontogram,
  } = useDentalStore();

  const [activeTab, setActiveTab] = useState<"queue" | "odontogram" | "cms">(
    "queue"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // KPI Calculations
  const totalAppointments = appointments.length;
  const waitingCount = appointments.filter((a) => a.status === "Waiting").length;
  const inTreatmentCount = appointments.filter(
    (a) => a.status === "In Treatment"
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  // Filtered appointments
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.phone.includes(searchQuery) ||
      appt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "In Treatment":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#355D81] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C1E55B] animate-pulse" />
            In Treatment
          </span>
        );
      case "Waiting":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            Waiting (Lounge)
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <X className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-[#355D81] text-[11px] font-bold px-2.5 py-1 rounded-full">
            Pending Confirmation
          </span>
        );
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#355D81]/10 text-[#355D81] px-2.5 py-0.5 rounded-full">
              Operations & Clinic Management
            </span>
            <span className="text-xs text-slate-400">
              Senin, 12 Oktober 2026
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight mt-1"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            Staff Operations Dashboard
          </h1>
        </div>

        {/* Action Button: Add Walk-in */}
        <div className="flex items-center gap-3">
          <button
            onClick={openWalkInModal}
            className="inline-flex items-center gap-2 bg-[#C1E55B] hover:bg-[#b0d44a] text-[#1E293B] font-bold px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <UserPlus className="w-4 h-4 text-[#1E293B]" />
            <span>+ Registrasi Pasien Walk-in</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Janji Temu Hari Ini
            </p>
            <h3 className="text-3xl font-black text-[#1E293B] mt-1">
              {totalAppointments}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {completedCount} pasien telah selesai
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#355D81]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ruang Tunggu (Waiting)
            </p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">
              {waitingCount}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Pasien sudah check-in tiba di klinik
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sedang Tindakan (In Chair)
            </p>
            <h3 className="text-3xl font-black text-[#355D81] mt-1">
              {inTreatmentCount}{" "}
              <span className="text-sm font-semibold text-slate-400">/ 2 Kursi</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              Chair 1 & Chair 2 aktif
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#355D81]/10 flex items-center justify-center text-[#355D81]">
            <Armchair className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selesai Hari Ini
            </p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">
              {completedCount}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Tindakan tuntas 100% steril
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Staff Navigation Pills */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("queue")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "queue"
              ? "border-[#355D81] text-[#355D81]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Antrean Operasional Harian</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-bold">
            {totalAppointments}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("odontogram")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "odontogram"
              ? "border-[#355D81] text-[#355D81]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Mini Odontogram & Rekam Medis</span>
        </button>

        <button
          onClick={() => setActiveTab("cms")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "cms"
              ? "border-[#355D81] text-[#355D81]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Pengaturan CMS & Layanan</span>
        </button>
      </div>

      {/* TAB 1: Operations Queue Tracker Table */}
      {activeTab === "queue" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama pasien, WhatsApp, kode DNT-..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#355D81] text-slate-800 font-medium"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "All",
                "Waiting",
                "In Treatment",
                "Pending",
                "Completed",
                "Cancelled",
              ].map((status) => {
                const count =
                  status === "All"
                    ? appointments.length
                    : appointments.filter((a) => a.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      statusFilter === status
                        ? "bg-[#355D81] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{status}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-5">ID & Pasien</th>
                  <th className="py-3 px-4">Kontak WhatsApp</th>
                  <th className="py-3 px-4">Layanan & Estimasi</th>
                  <th className="py-3 px-4">Dokter & Waktu</th>
                  <th className="py-3 px-4">Alokasi Chair</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Tidak ada data antrean yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => (
                    <tr
                      key={appt.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Patient Name & ID */}
                      <td className="py-3.5 px-5">
                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {appt.patientName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-mono text-[#355D81] font-bold">
                            {appt.id}
                          </span>
                          <span>•</span>
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                            {appt.patientType}
                          </span>
                        </div>
                      </td>

                      {/* WhatsApp Phone */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700">
                            {appt.phone}
                          </span>
                        </div>
                        <a
                          href={`https://wa.me/${appt.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-emerald-600 hover:underline font-semibold inline-flex items-center gap-0.5 mt-0.5"
                        >
                          Kirim Pengingat WA
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>

                      {/* Service & Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 line-clamp-1">
                          {appt.serviceName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {formatIDR(appt.estimatedPrice)}
                        </div>
                      </td>

                      {/* Doctor & Slot */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#355D81] line-clamp-1">
                          {appt.doctorName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{appt.timeSlot}</span>
                        </div>
                      </td>

                      {/* Dental Chair */}
                      <td className="py-3.5 px-4">
                        <select
                          value={appt.chair}
                          onChange={(e) =>
                            assignChair(appt.id, e.target.value as DentalChair)
                          }
                          className="text-[11px] font-bold p-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-1 focus:ring-[#355D81]"
                        >
                          <option value="Not Assigned">Ruang Tunggu</option>
                          <option value="Chair 1 (Lounge A)">Chair 1</option>
                          <option value="Chair 2 (Lounge B)">Chair 2</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(appt.status)}
                      </td>

                      {/* Quick Actions Buttons */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If Pending -> Check In */}
                          {appt.status === "Pending" && (
                            <button
                              onClick={() =>
                                updateAppointmentStatus(appt.id, "Waiting")
                              }
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                              title="Tandai Pasien Tiba (Check-in)"
                            >
                              Check-in
                            </button>
                          )}

                          {/* If Waiting -> Send to Chair 1 */}
                          {appt.status === "Waiting" && (
                            <button
                              onClick={() =>
                                assignChair(appt.id, "Chair 1 (Lounge A)")
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#355D81] hover:bg-[#254361] text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                              title="Kirim ke Dental Chair 1"
                            >
                              <Armchair className="w-3 h-3 text-[#C1E55B]" />
                              <span>Ke Chair</span>
                            </button>
                          )}

                          {/* If In Treatment -> Mark Done */}
                          {appt.status === "In Treatment" && (
                            <button
                              onClick={() =>
                                updateAppointmentStatus(appt.id, "Completed")
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                              title="Tandai Selesai Tindakan"
                            >
                              <Check className="w-3 h-3" />
                              <span>Selesai</span>
                            </button>
                          )}

                          {/* Open in Odontogram */}
                          <button
                            onClick={() => {
                              setActivePatientForOdontogram(appt.patientName);
                              setActiveTab("odontogram");
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-[#355D81] hover:bg-slate-100 transition-colors"
                            title="Buka Odontogram Pasien Ini"
                          >
                            <Activity className="w-3.5 h-3.5" />
                          </button>

                          {/* Cancel / Delete */}
                          <button
                            onClick={() =>
                              updateAppointmentStatus(appt.id, "Cancelled")
                            }
                            className="p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Batalkan Janji Temu"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Mini Odontogram Chart */}
      {activeTab === "odontogram" && <OdontogramChart />}

      {/* TAB 3: Mini CMS Configurator */}
      {activeTab === "cms" && <CmsConfigPanel />}

      {/* Walk-In Registration Modal */}
      <AddWalkInModal />
    </div>
  );
};
