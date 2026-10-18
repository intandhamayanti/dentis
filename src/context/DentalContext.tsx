"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Appointment,
  AppointmentStatus,
  DentalChair,
  DentalService,
  Doctor,
  CmsConfig,
  ToothState,
  ToothCondition,
} from "../types/dental";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_DOCTORS,
  INITIAL_SERVICES,
  INITIAL_CMS_CONFIG,
  INITIAL_ODONTOGRAM,
} from "../lib/mockData";

interface ToastNotification {
  id: string;
  type: "success" | "info" | "warning";
  message: string;
}

interface DentalContextType {
  activeView: "portal" | "staff";
  setActiveView: (view: "portal" | "staff") => void;

  // Appointments / Queue
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt">) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  assignChair: (id: string, chair: DentalChair) => void;
  deleteAppointment: (id: string) => void;

  // Doctors & Services
  doctors: Doctor[];
  services: DentalService[];
  updateServiceAvailability: (id: string, isAvailable: boolean) => void;
  updateServicePrice: (id: string, basePrice: number, maxPrice: number) => void;

  // CMS
  cmsConfig: CmsConfig;
  updateCmsConfig: (updates: Partial<CmsConfig>) => void;

  // Odontogram
  activePatientOdontogram: {
    patientName: string;
    teeth: Record<number, ToothState>;
    clinicalNotes: string;
  };
  setActivePatientForOdontogram: (patientName: string) => void;
  updateTooth: (fdiNumber: number, condition: ToothCondition, note?: string) => void;
  updateClinicalNotes: (notes: string) => void;
  resetOdontogram: () => void;

  // Modals
  isBookingModalOpen: boolean;
  preselectedServiceId: string | null;
  preselectedDoctorId: string | null;
  openBookingModal: (serviceId?: string, doctorId?: string) => void;
  closeBookingModal: () => void;

  isWalkInModalOpen: boolean;
  openWalkInModal: () => void;
  closeWalkInModal: () => void;

  // Toasts
  toast: ToastNotification | null;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  clearToast: () => void;
}

const DentalContext = createContext<DentalContextType | undefined>(undefined);

export const DentalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeView, setActiveView] = useState<"portal" | "staff">("portal");
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [services, setServices] = useState<DentalService[]>(INITIAL_SERVICES);
  const [cmsConfig, setCmsConfig] = useState<CmsConfig>(INITIAL_CMS_CONFIG);

  const [activePatientOdontogram, setActivePatientOdontogram] = useState<{
    patientName: string;
    teeth: Record<number, ToothState>;
    clinicalNotes: string;
  }>({
    patientName: "Clarissa Amanda",
    teeth: INITIAL_ODONTOGRAM,
    clinicalNotes:
      "Pasien rutin per 6 bulan. Gigi 26 pit karies ringan perlu diobservasi/preventive filling. Gigi 16 restorasi komposit dalam kondisi baik.",
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);

  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedAppointments = localStorage.getItem("dentis_appointments");
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      }
      const savedCms = localStorage.getItem("dentis_cms");
      if (savedCms) {
        setCmsConfig(JSON.parse(savedCms));
      }
      const savedOdontogram = localStorage.getItem("dentis_odontogram");
      if (savedOdontogram) {
        setActivePatientOdontogram(JSON.parse(savedOdontogram));
      }
    } catch {
      // Ignore storage errors on restricted environments
    }
  }, []);

  // Sync appointments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dentis_appointments", JSON.stringify(appointments));
    } catch {}
  }, [appointments]);

  // Sync CMS to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dentis_cms", JSON.stringify(cmsConfig));
    } catch {}
  }, [cmsConfig]);

  // Sync Odontogram to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("dentis_odontogram", JSON.stringify(activePatientOdontogram));
    } catch {}
  }, [activePatientOdontogram]);

  const showToast = (
    message: string,
    type: "success" | "info" | "warning" = "success"
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const addAppointment = (
    appointmentData: Omit<Appointment, "id" | "createdAt">
  ): Appointment => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `DNT-${randomNum}`,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(
      `Pendaftaran pasien ${newAppointment.patientName} berhasil dicatat (${newAppointment.id})!`,
      "success"
    );
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    showToast(`Status antrean diperbarui menjadi "${status}"`, "info");
  };

  const assignChair = (id: string, chair: DentalChair) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              chair,
              status: chair !== "Not Assigned" ? "In Treatment" : item.status,
            }
          : item
      )
    );
    showToast(
      chair !== "Not Assigned"
        ? `Pasien diarahkan ke ${chair}`
        : "Alokasi dental chair dibatalkan",
      "info"
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((item) => item.id !== id));
    showToast("Jadwal janji temu telah dihapus.", "warning");
  };

  const updateServiceAvailability = (id: string, isAvailable: boolean) => {
    setServices((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, isAvailable } : srv))
    );
    setCmsConfig((prev) => ({
      ...prev,
      serviceAvailability: {
        ...prev.serviceAvailability,
        [id]: isAvailable,
      },
    }));
    showToast(
      `Status ketersediaan layanan berhasil diubah ke ${
        isAvailable ? "Tersedia" : "Penuh"
      }`,
      "info"
    );
  };

  const updateServicePrice = (id: string, basePrice: number, maxPrice: number) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id ? { ...srv, basePrice, maxPrice } : srv
      )
    );
    setCmsConfig((prev) => ({
      ...prev,
      serviceCustomPrices: {
        ...prev.serviceCustomPrices,
        [id]: basePrice,
      },
    }));
    showToast("Harga estimasi layanan berhasil diperbarui!", "success");
  };

  const updateCmsConfig = (updates: Partial<CmsConfig>) => {
    setCmsConfig((prev) => ({ ...prev, ...updates }));
    showToast("Pengaturan CMS Dentis berhasil disimpan!", "success");
  };

  const setActivePatientForOdontogram = (patientName: string) => {
    setActivePatientOdontogram((prev) => ({
      ...prev,
      patientName,
    }));
    showToast(`Memuat diagram odontogram untuk ${patientName}`, "info");
  };

  const updateTooth = (
    fdiNumber: number,
    condition: ToothCondition,
    note?: string
  ) => {
    setActivePatientOdontogram((prev) => {
      const existing = prev.teeth[fdiNumber] || {
        fdiNumber,
        condition: "Healthy",
      };
      return {
        ...prev,
        teeth: {
          ...prev.teeth,
          [fdiNumber]: {
            ...existing,
            condition,
            note: note !== undefined ? note : existing.note,
          },
        },
      };
    });
  };

  const updateClinicalNotes = (notes: string) => {
    setActivePatientOdontogram((prev) => ({
      ...prev,
      clinicalNotes: notes,
    }));
  };

  const resetOdontogram = () => {
    const cleanOdontogram: Record<number, ToothState> = {};
    for (let i = 11; i <= 48; i++) {
      cleanOdontogram[i] = { fdiNumber: i, condition: "Healthy" };
    }
    setActivePatientOdontogram((prev) => ({
      ...prev,
      teeth: cleanOdontogram,
      clinicalNotes: "Pemeriksaan baru. Semua elemen gigi dalam kondisi sehat.",
    }));
    showToast("Diagram odontogram direset ke kondisi awal (Sehat).", "info");
  };

  const openBookingModal = (serviceId?: string, doctorId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setPreselectedDoctorId(doctorId || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedServiceId(null);
    setPreselectedDoctorId(null);
  };

  const openWalkInModal = () => setIsWalkInModalOpen(true);
  const closeWalkInModal = () => setIsWalkInModalOpen(false);

  return (
    <DentalContext.Provider
      value={{
        activeView,
        setActiveView,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        assignChair,
        deleteAppointment,
        doctors,
        services,
        updateServiceAvailability,
        updateServicePrice,
        cmsConfig,
        updateCmsConfig,
        activePatientOdontogram,
        setActivePatientForOdontogram,
        updateTooth,
        updateClinicalNotes,
        resetOdontogram,
        isBookingModalOpen,
        preselectedServiceId,
        preselectedDoctorId,
        openBookingModal,
        closeBookingModal,
        isWalkInModalOpen,
        openWalkInModal,
        closeWalkInModal,
        toast,
        showToast,
        clearToast,
      }}
    >
      {children}
    </DentalContext.Provider>
  );
};

export const useDentalStore = () => {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error("useDentalStore must be used within a DentalProvider");
  }
  return context;
};
