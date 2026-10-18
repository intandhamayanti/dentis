export type AppointmentStatus =
  | "Pending"
  | "Waiting"
  | "In Treatment"
  | "Completed"
  | "Cancelled";

export type PatientType = "New Patient" | "Regular Patient";

export type DentalChair = "Chair 1 (Lounge A)" | "Chair 2 (Lounge B)" | "Not Assigned";

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  image: string;
  scheduleToday: string;
  statusToday: "In Clinic" | "Next Slot 14:00" | "Available";
  bio: string;
}

export interface DentalService {
  id: string;
  name: string;
  shortName: string;
  category: "Preventive" | "Cosmetic" | "Orthodontics" | "Restorative" | "Surgical";
  basePrice: number; // in IDR
  maxPrice: number;
  durationMinutes: number;
  description: string;
  features: string[];
  popular?: boolean;
  isAvailable: boolean;
  iconName: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  patientType: PatientType;
  serviceId: string;
  serviceName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  chair: DentalChair;
  estimatedPrice: number;
  notes?: string;
  createdAt: string;
}

export type ToothCondition =
  | "Healthy"
  | "Caries"
  | "Filling"
  | "Extraction"
  | "Crown/Veneer";

export interface ToothState {
  fdiNumber: number; // 11-48
  condition: ToothCondition;
  note?: string;
}

export interface PatientClinicalRecord {
  patientId: string;
  patientName: string;
  teeth: Record<number, ToothState>;
  clinicalNotes: string;
  lastUpdated: string;
}

export interface CmsConfig {
  announcementText: string;
  showAnnouncement: boolean;
  announcementBadge: string;
  promoDiscountPercent: number;
  emergencyContact: string;
  clinicAddress: string;
  serviceAvailability: Record<string, boolean>;
  serviceCustomPrices: Record<string, number>;
}
