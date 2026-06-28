import { MapPin } from 'lucide-react'
import { getCentrosAcopio } from '@/lib/supabase'
import { CentroCard, CentroCardSkeleton } from '@/components/acopio/centro-card'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function Centros() {
  const centros = await getCentrosAcopio().catch(() => [])
  if (!centros.length) {
    return (
      <div className="text-center py-20">
        <p className="text-6xl mb-4">🏪</p>
        <p className="text-xl font-bold">No hay centros activos en este momento</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {centros.map(c => <CentroCard key={c.id} centro={c} />)}
    </div>
  )
}

export default function AcopioPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 bg-[#FF6600] rounded-xl flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-black">Centros de acopio</h1>
          <p className="text-black/50 mt-1">Centros activos con inventario actualizado en tiempo real.</p>
        </div>
      </div>

      <div className="bg-[#FF6600]/5 border border-[#FF6600]/20 rounded-2xl px-5 py-4 mb-8">
        <p className="text-sm font-semibold text-[#FF6600] mb-1">¿Quieres donar?</p>
        <p className="text-sm text-black/60">
          Contacta directamente al responsable del centro. Revisa las necesidades urgentes antes de ir.
        </p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CentroCardSkeleton key={i} />)}
        </div>
      }>
        <Centros />
      </Suspense>
    </div>
  )
}
