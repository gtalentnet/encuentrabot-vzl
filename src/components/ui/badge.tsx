import { cn } from '@/lib/utils'
import { urgenciaConfig, estadoConfig } from '@/lib/utils'
import type { UrgenciaNivel, EstadoPersona } from '@/lib/types'

export function UrgenciaBadge({ nivel }: { nivel: UrgenciaNivel }) {
  const cfg = urgenciaConfig[nivel] ?? urgenciaConfig['Medio']
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.bg, cfg.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', cfg.dot)} aria-hidden="true" />
      {cfg.label ?? nivel}
    </span>
  )
}

export function EstadoBadge({ estado }: { estado: EstadoPersona }) {
  const cfg = estadoConfig[estado]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  )
}
