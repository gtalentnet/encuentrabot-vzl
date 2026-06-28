import Link from 'next/link'
import { Search, MapPin, FileText, Bell, ArrowRight, Users } from 'lucide-react'
import { getAlertas, getCentrosAcopio, getStatsGenerales } from '@/lib/supabase'
import { AlertaCard } from '@/components/alertas/alerta-card'
import { CentroCard } from '@/components/acopio/centro-card'
import { HomeBuscador } from '@/components/home/home-buscador'

export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const [alertas, centros, stats] = await Promise.all([
      getAlertas(3),
      getCentrosAcopio(),
      getStatsGenerales(),
    ])
    return { alertas, centros, stats }
  } catch {
    return { alertas: [], centros: [], stats: { totalPersonas: 0, desaparecidos: 0, centrosActivos: 0, alertasActivas: 0 } }
  }
}

export default async function HomePage() {
  const { alertas, centros, stats } = await getData()

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="bg-black text-white px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#FF6600] font-semibold text-sm uppercase tracking-widest mb-4">
            Respuesta de emergencia activa
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-6">
            ¿A quién<br />
            <span className="text-[#FF6600]">estás buscando?</span>
          </h1>
          <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
            Busca entre las personas reportadas, ubica centros de acopio o reporta a alguien desaparecido.
          </p>
          <HomeBuscador />
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-black/10 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users,  label: 'Personas reportadas', value: stats.totalPersonas, color: 'text-black' },
              { icon: Search, label: 'Desaparecidos',       value: stats.desaparecidos,  color: 'text-red-600' },
              { icon: MapPin, label: 'Centros activos',     value: stats.centrosActivos, color: 'text-[#FF6600]' },
              { icon: Bell,   label: 'Alertas activas',     value: stats.alertasActivas, color: 'text-[#FF6600]' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-4">
                <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-black/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCIONES RÁPIDAS */}
      <section className="bg-black/[0.02] border-b border-black/10 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/reportar"
              className="group bg-[#FF6600] rounded-2xl p-6 flex items-center justify-between hover:bg-orange-700 transition-colors min-h-[80px]"
            >
              <div>
                <p className="text-white font-black text-xl">Reportar persona</p>
                <p className="text-white/70 text-sm mt-1">Desaparecida o encontrada</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <FileText className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
            </Link>
            <Link
              href="/acopio"
              className="group bg-black rounded-2xl p-6 flex items-center justify-between hover:bg-black/80 transition-colors min-h-[80px]"
            >
              <div>
                <p className="text-white font-black text-xl">Centros de acopio</p>
                <p className="text-white/50 text-sm mt-1">Ver ubicaciones y necesidades</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
            </Link>
            <Link
              href="/alertas"
              className="group bg-white border-2 border-black/10 rounded-2xl p-6 flex items-center justify-between hover:border-[#FF6600] transition-colors min-h-[80px]"
            >
              <div>
                <p className="text-black font-black text-xl">Alertas oficiales</p>
                <p className="text-black/50 text-sm mt-1">Información verificada</p>
              </div>
              <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center group-hover:bg-[#FF6600]/10 transition-colors">
                <Bell className="w-6 h-6 text-black group-hover:text-[#FF6600]" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ALERTAS RECIENTES */}
      {alertas.length > 0 && (
        <section className="px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Alertas recientes</h2>
              <Link href="/alertas" className="flex items-center gap-1 text-sm text-[#FF6600] font-semibold hover:underline">
                Ver todas <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alertas.map(a => <AlertaCard key={a.id} alerta={a} compact />)}
            </div>
          </div>
        </section>
      )}

      {/* CENTROS DE ACOPIO */}
      {centros.length > 0 && (
        <section className="px-4 py-12 bg-black/[0.02] border-t border-black/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Centros de acopio activos</h2>
              <Link href="/acopio" className="flex items-center gap-1 text-sm text-[#FF6600] font-semibold hover:underline">
                Ver todos <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {centros.slice(0, 3).map(c => <CentroCard key={c.id} centro={c} />)}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
