// ─── USER & AUTH ───
export interface User {
  id: string;
  email: string;
  fullName: string;
  companyName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
  plan: "starter" | "pro" | "business" | "enterprise";
  createdAt: string;
  updatedAt: string;
}

// ─── QUOTES ───
export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "expired";

export interface QuoteLineItem {
  id: string;
  description: string;
  category: "labour" | "material" | "equipment" | "other";
  quantity: number;
  unit: string; // e.g., "m²", "hours", "bags", "each"
  unitPrice: number; // In cents (ZAR)
  total: number; // quantity * unitPrice
}

export interface Quote {
  id: string;
  quoteNumber: string; // e.g., "QT-2026-0001"
  userId: string;
  clientId: string;
  client: Client;
  title: string;
  description: string | null;
  lineItems: QuoteLineItem[];
  subtotal: number; // In cents
  vatAmount: number; // In cents (subtotal * 0.15)
  total: number; // In cents (subtotal + vatAmount)
  includeVat: boolean;
  validUntil: string; // ISO date
  terms: string | null;
  notes: string | null;
  status: QuoteStatus;
  sentAt: string | null;
  viewedAt: string | null;
  respondedAt: string | null;
  signatureUrl: string | null; // Client's digital signature
  createdAt: string;
  updatedAt: string;
}

// ─── CLIENTS ───
export interface Client {
  id: string;
  userId: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  province: string | null;
  notes: string | null;
  totalQuotes: number;
  totalProjects: number;
  createdAt: string;
  updatedAt: string;
}

// ─── PROJECTS ───
export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  percentComplete: number; // 0-100
  dueDate: string | null;
  completedAt: string | null;
  order: number;
}

export interface SiteDiaryEntry {
  id: string;
  projectId: string;
  date: string;
  weather: "sunny" | "cloudy" | "rainy" | "windy" | "stormy";
  temperature: number | null;
  workersOnSite: number;
  notes: string;
  photos: string[]; // URLs from Supabase storage
  createdBy: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  clientId: string;
  client: Client;
  quoteId: string | null; // Linked quote (if converted from quote)
  name: string;
  description: string | null;
  address: string;
  city: string;
  province: string;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  budget: number; // In cents
  spent: number; // In cents (calculated)
  percentComplete: number; // 0-100 (derived from milestones)
  milestones: ProjectMilestone[];
  diaryEntries: SiteDiaryEntry[];
  createdAt: string;
  updatedAt: string;
}

// ─── INVOICES (V2) ───
export type InvoiceStatus = "draft" | "sent" | "paid" | "partial" | "overdue";

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "INV-2026-0001"
  userId: string;
  clientId: string;
  projectId: string | null;
  quoteId: string | null;
  lineItems: QuoteLineItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentLink: string | null; // Yoco/PayFast link
  sentAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── SOUTH AFRICAN PROVINCES ───
export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
] as const;

export type SAProvince = (typeof SA_PROVINCES)[number];
