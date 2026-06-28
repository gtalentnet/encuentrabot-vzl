import Link from 'next/link'
import { AlertTriangle, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FF6600] rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-black text-lg">Levanta Venezuela</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Plataforma oficial de coordinación de emergencia post-sismo para Caracas y La Guaira.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm text-white/70 uppercase tracking-widest mb-4">
              Acceso rápido
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/personas', label: 'Buscar personas' },
                { href: '/reportar', label: 'Reportar desaparecido' },
                { href: '/acopio',   label: 'Centros de acopio' },
                { href: '/alertas',  label: 'Alertas y noticias' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#FF6600] text-sm transition-colors min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergencias */}
          <div>
            <h3 className="font-semibold text-sm text-white/70 uppercase tracking-widest mb-4">
              Líneas de emergencia
            </h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><span className="text-[#FF6600] font-semibold">911</span> — Emergencias</li>
              <li><span className="text-[#FF6600] font-semibold">0800-PROTECCION</span> — Protección Civil</li>
              <li><span className="text-[#FF6600] font-semibold">Telegram:</span> @encuentraVZL</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center">
            Una iniciativa de{' '}
            <a
              href="https://g-talent.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6600] hover:underline"
            >
              G-Talent.net
            </a>
            {' '}· G-Talent Labs · {new Date().getFullYear()}
          </p>
          <p className="text-white/30 text-xs flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-[#FF6600] fill-[#FF6600]" aria-hidden="true" /> para Venezuela
          </p>
        </div>
      </div>
    </footer>
  )
}
