import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('sk-SK', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('sk-SK', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(date));
}
