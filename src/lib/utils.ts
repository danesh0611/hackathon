import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx — standard Shadcn utility */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with commas (e.g., 1234567 → "12,34,567" Indian format) */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-IN");
}

/** Format a date string to a readable format */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format a date string with time */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Get risk color class (always paired with icon/text for accessibility) */
export function getRiskColorClass(risk: "Low" | "Medium" | "High"): string {
  const map: Record<string, string> = {
    High: "text-risk-high bg-risk-high/10 border-risk-high/30",
    Medium: "text-risk-medium bg-risk-medium/10 border-risk-medium/30",
    Low: "text-risk-low bg-risk-low/10 border-risk-low/30",
  };
  return map[risk] ?? "";
}

/** Get severity color class for map markers */
export function getSeverityColorClass(severity: "low" | "medium" | "high"): string {
  const map: Record<string, string> = {
    high: "text-risk-high",
    medium: "text-risk-medium",
    low: "text-risk-low",
  };
  return map[severity] ?? "";
}

/** Get case status label and color */
export function getCaseStatusConfig(status: string): { label: string; className: string } {
  const map: Record<string, { label: string; className: string }> = {
    open: { label: "Open", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    investigating: { label: "Investigating", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    resolved: { label: "Resolved", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
    closed: { label: "Closed", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
  };
  return map[status] ?? { label: status, className: "bg-gray-100 text-gray-800" };
}

/** Get case type label */
export function getCaseTypeLabel(type: string): string {
  const map: Record<string, string> = {
    scam: "Scam",
    counterfeit: "Counterfeit Currency",
    fraud_call: "Fraud Call",
    digital_arrest: "Digital Arrest",
  };
  return map[type] ?? type;
}

/** Truncate text with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

/** Check if a JWT token is expired */
export function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.exp * 1000 < Date.now();
  } catch {
    return false; // Don't aggressively expire mock tokens if they are malformed
  }
}
