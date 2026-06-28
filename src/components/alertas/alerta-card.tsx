import { ExternalLink } from 'lucide-react'
import { UrgenciaBadge } from '@/components/ui/badge'
import { formatFechaCorta } from '@/lib/utils'
import type { AlertaNoticia } from '@/lib/types'

interface AlertaCardProps {
  alerta: AlertaNoticia
  compact?: boolean
}

export function AlertaCard({ alerta, compact }: AlertaCardProps) {
  return (
    <article className="bg-white border border-black/10 rounded-2xl p-5 hover:shadow-md transition-all duration-200 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <UrgenciaBadge nivel={alerta.urgencia} />
            <span className="text-xs text-black/40">{alerta.fuente}</span>
            <span className="text-xs text-black/30">·</span>
            <span className="text-xs text-black/40">{formatFechaCorta(alerta.creado_en)}</span>
          </div>
          <h3 className="font-bold text-base text-black leading-tight mb-2">{alerta.titulo}</h3>
          {!compact && (
            <p className="text-sm text-black/60 leading-relaxed">{alerta.cuerpo}</p>
          )}
          {alerta.tags && alerta.tags.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {alerta.tags.map(tag => (
                <span key={tag} className="text-xs bg-black/5 text-black/50 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {alerta.fuente_url && (
          <a
            href={alerta.fuente_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 rounded-lg hover:bg-black/5 text-black/30 hover:text-black transition-colors min-h-0"
            aria-label="Ver fuente original"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  )
}
