import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function localizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const key = `${field}${locale === "en" ? "En" : locale === "fr" ? "Fr" : "Ar"}`;
  const value = item[key as keyof T];
  if (typeof value === "string" && value.length > 0) return value;
  const fallback = item[`${field}En` as keyof T];
  return typeof fallback === "string" ? fallback : "";
}
