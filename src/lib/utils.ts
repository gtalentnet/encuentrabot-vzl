import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UrgenciaNivel, EstadoPersona } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFecha(iso: string) {
  return new Intl.DateTimeFormat('es-VE', {
    timeZone: 'America/Caracas',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatFechaCorta(iso: string) {
  return new Intl.DateTimeFormat('es-VE', {
    timeZone: 'America/Caracas',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export const urgenciaConfig: Record<UrgenciaNivel, { label: string; color: string; bg: string; dot: string }> = {
  Crítico: { label: 'Crítico', color: 'text-red-700',   bg: 'bg-red-50   border-red-200',   dot: 'bg-red-500' },
  Alto:    { label: 'Alto',    color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-[#FF6600]' },
  Medio:   { label: 'Medio',   color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  Bajo:    { label: 'Bajo',    color: 'text-green-700',  bg: 'bg-green-50  border-green-200',  dot: 'bg-green-500' },
}

export const estadoConfig: Record<EstadoPersona, { label: string; color: string; bg: string }> = {
  Desaparecido: { label: 'Desaparecido', color: 'text-red-700',   bg: 'bg-red-50 border border-red-200' },
  Encontrado:   { label: 'Encontrado',   color: 'text-green-700', bg: 'bg-green-50 border border-green-200' },
  Reunificado:  { label: 'Reunificado',  color: 'text-blue-700',  bg: 'bg-blue-50 border border-blue-200' },
}
