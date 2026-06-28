import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function daysUntil(dateStr: string, today: Date): number {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);

  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);

  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

export function formatDateLabel(dateStr: string, today: Date | null): string {
  if (!today) {
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  const days = daysUntil(dateStr, today);

  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  if (days < 0) return `Atrasada ${Math.abs(days)}d`;

  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
