import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, locale = 'es'): string {
  const date = new Date(dateString)
  const dateFnsLocale = locale === 'es' ? es : enUS
  return format(date, 'PPP', { locale: dateFnsLocale })
}

export function truncate(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}