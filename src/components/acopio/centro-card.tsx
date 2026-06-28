import { MapPin, Clock, Phone, User, ExternalLink } from 'lucide-react'
import { UrgenciaBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CentroAcopio } from '@/lib/types'

interface CentroCardProps {
  centro: CentroAcopio
}

const urgenciaOrden = { Crítico: 0, Alto: 1, Medio: 2, Bajo: 3 }

export function CentroCard({ centro }: CentroCardProps) {
  const inventario = centro.inventario_acopio ?? []
  const criticos = inventario
    .filter(i => i.urgencia === 'Crítico' || i.urgencia === 'Alto')
    .sort((a, b) => urgenciaOrden[a.urgencia] - urgenciaOrden[b.urgencia])
    .slice(0, 4)

  const mapsUrl = centro.latitud && centro.longitud
    ? `https://www.google.com/maps?q=${centro.latitud},${centro.longitud}`
    : `https://www.google.com/maps/search/${encodeURIComponent(`${centro.nombre} ${centro.direccion} Venezuela`)}`

  return (
    <article className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#FF6600]/30 transition-all duration-200 animate-slide-up">
      {/* Header */}
      <div className="bg-black px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{centro.nombre}</h3>
            <p className="text-white/50 text-sm mt-0.5">{centro.zona}</p>
          </div>
          <span className="flex-shrink-0 bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-500/30">
            Activo
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Info */}
        <div className="space-y-2 text-sm text-black/60">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#FF6600]" aria-hidden="true" />
            <span>{centro.direccion}{centro.referencia ? ` — ${centro.referencia}` : ''}</span>
          </div>
          {centro.horario && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0 text-[#FF6600]" aria-hidden="true" />
              <span>{centro.horario}</span>
            </div>
          )}
          {centro.responsable && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 flex-shrink-0 text-[#FF6600]" aria-hidden="true" />
              <span>{centro.responsable}{centro.telefono ? ` · ${centro.telefono}` : ''}</span>
            </div>
          )}
          {centro.telefono && !centro.responsable && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0 text-[#FF6600]" aria-hidden="true" />
              <span>{centro.telefono}</span>
            </div>
          )}
        </div>

        {/* Inventario crítico */}
        {criticos.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-2">
              Necesidades urgentes
            </p>
            <div className="flex flex-wrap gap-2">
              {criticos.map(item => (
                <div key={item.id} className="flex items-center gap-1.5">
                  <UrgenciaBadge nivel={item.urgencia} />
                  <span className="text-xs text-black/60">{item.insumo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block">
          <Button variant="outline" size="md" className="w-full rounded-xl">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            Ver en mapa
            <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50" aria-hidden="true" />
          </Button>
        </a>
      </div>
    </article>
  )
}

export function CentroCardSkeleton() {
  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-black/5 h-20" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-black/5 rounded w-full" />
        <div className="h-4 bg-black/5 rounded w-2/3" />
        <div className="h-10 bg-black/5 rounded-xl" />
      </div>
    </div>
  )
}
