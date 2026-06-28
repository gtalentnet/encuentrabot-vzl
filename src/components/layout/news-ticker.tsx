'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { getAlertas } from '@/lib/supabase'
import type { AlertaNoticia } from '@/lib/types'

export function NewsTicker() {
  const [alertas, setAlertas] = useState<AlertaNoticia[]>([])

  useEffect(() => {
    getAlertas(5)
      .then(setAlertas)
      .catch(() => {})
  }, [])

  if (!alertas.length) return null

  const tickerText = alertas
    .map(a => `${a.urgencia === 'Crítico' ? '🔴' : '🟠'} ${a.titulo}`)
    .join('   ·   ')

  return (
    <div className="bg-black text-white overflow-hidden py-2 relative z-50">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 bg-[#FF6600] px-4 py-1 z-10">
          <AlertTriangle className="w-4 h-4 text-white" aria-hidden="true" />
          <span className="text-white font-semibold text-xs uppercase tracking-widest whitespace-nowrap">
            Alerta
          </span>
        </div>
        <div className="overflow-hidden flex-1">
          <p className="ticker-content text-sm text-white/90">
            {tickerText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{tickerText}
          </p>
        </div>
      </div>
    </div>
  )
}
