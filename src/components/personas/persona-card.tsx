import { MapPin, Clock, Phone, User } from 'lucide-react'
import { EstadoBadge } from '@/components/ui/badge'
import { formatFechaCorta } from '@/lib/utils'
import type { Persona } from '@/lib/types'

interface PersonaCardProps {
  persona: Persona
  onClick?: () => void
}

export function PersonaCard({ persona, onClick }: PersonaCardProps) {
  return (
    <article
      className="bg-white border border-black/10 rounded-2xl p-5 hover:border-[#FF6600]/50 hover:shadow-md transition-all duration-200 cursor-pointer animate-slide-up"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {persona.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={persona.foto_url} alt={persona.nombre_completo} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-black/30" aria-hidden="true" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-black leading-tight">{persona.nombre_completo}</h3>
            {persona.edad && (
              <p className="text-sm text-black/50">{persona.edad} años{persona.sexo ? ` · ${persona.sexo === 'M' ? 'Masculino' : persona.sexo === 'F' ? 'Femenino' : 'Otro'}` : ''}</p>
            )}
          </div>
        </div>
        <EstadoBadge estado={persona.estado} />
      </div>

      {persona.descripcion && (
        <p className="text-sm text-black/60 mb-3 line-clamp-2">{persona.descripcion}</p>
      )}

      <div className="flex flex-col gap-1.5 text-sm text-black/50">
        {persona.ultima_ubicacion && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{persona.ultima_ubicacion}</span>
          </div>
        )}
        {persona.contacto && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{persona.contacto}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>Reportado: {formatFechaCorta(persona.fecha_reporte)}</span>
        </div>
      </div>
    </article>
  )
}

export function PersonaCardSkeleton() {
  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-black/5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-black/5 rounded w-2/3" />
          <div className="h-4 bg-black/5 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-black/5 rounded w-full" />
        <div className="h-4 bg-black/5 rounded w-3/4" />
      </div>
    </div>
  )
}
