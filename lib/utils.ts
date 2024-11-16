import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (phone: string) => {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};
