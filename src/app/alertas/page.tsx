import { Bell } from 'lucide-react'
import { getAlertas } from '@/lib/supabase'
import { AlertaCard } from '@/components/alertas/alerta-card'

export const dynamic = 'force-dynamic'

export default async function AlertasPage() {
  const alertas = await getAlertas(20).catch(() => [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
          <Bell className="w-6 h-6 text-[#FF6600]" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-black">Alertas y noticias</h1>
          <p className="text-black/50 mt-1">Solo información verificada por G-Talent Labs.</p>
        </div>
      </div>

      {alertas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📰</p>
          <p className="text-xl font-bold">No hay alertas publicadas</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {alertas.map(a => <AlertaCard key={a.id} alerta={a} />)}
        </div>
      )}
    </div>
  )
}
