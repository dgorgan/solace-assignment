import { Advocate } from "./types";

export function toDigits(phone: unknown): string {
  return String(phone || '').replace(/\D/g, '');
}

export function formatUSPhone(digits: string): string {
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

function stableId(raw: any): string {
  const key = `${raw.firstName || ''}-${raw.lastName || ''}-${raw.phoneNumber || ''}-${raw.city || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
}

export function normalizeAdvocate(raw: any): Advocate {
  return {
    id: String(raw.id ?? stableId(raw)),
    firstName: String(raw.firstName || ''),
    lastName: String(raw.lastName || ''),
    city: String(raw.city || ''),
    degree: String(raw.degree || ''),
    specialties: Array.isArray(raw.specialties) ? raw.specialties : [],
    yearsOfExperience: Number(raw.yearsOfExperience) || 0,
    phoneNumber: toDigits(raw.phoneNumber)
  };
}
