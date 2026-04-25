import { VAT_RATE } from "@/config/site";

/**
 * Format cents to South African Rand display string.
 * e.g., 150000 → "R 1,500.00"
 */
export function formatZAR(cents: number): string {
  const rands = cents / 100;
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(rands);
}

/**
 * Calculate VAT amount from subtotal (both in cents).
 */
export function calculateVAT(subtotalCents: number): number {
  return Math.round(subtotalCents * VAT_RATE);
}

/**
 * Calculate total including VAT.
 */
export function calculateTotal(subtotalCents: number): {
  subtotal: number;
  vat: number;
  total: number;
} {
  const vat = calculateVAT(subtotalCents);
  return {
    subtotal: subtotalCents,
    vat,
    total: subtotalCents + vat,
  };
}

/**
 * Generate a sequential document number.
 * e.g., generateDocNumber("QT", 1) → "QT-2026-0001"
 */
export function generateDocNumber(prefix: string, sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(4, "0");
  return `${prefix}-${year}-${padded}`;
}

/**
 * Format a date string for South African locale.
 * e.g., "2026-04-25" → "25 April 2026"
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * Format a date as relative time.
 * e.g., "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate initials from a name.
 * e.g., "John Smith" → "JS"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Concatenate class names, filtering out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
