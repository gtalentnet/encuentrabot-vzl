import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { NewsTicker } from '@/components/layout/news-ticker'
import { TelegramFab } from '@/components/layout/telegram-fab'

export const metadata: Metadata = {
  title: 'Levanta Venezuela — Coordinación de Emergencia',
  description: 'Plataforma oficial de respuesta a emergencias. Busca personas desaparecidas, ubica centros de acopio y consulta alertas verificadas.',
  keywords: ['emergencia', 'Venezuela', 'sismo', 'personas desaparecidas', 'acopio'],
  icons: {
    icon: '/favicon.png',
    apple: '/isotipo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6600',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">
        <NewsTicker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <TelegramFab />
      </body>
    </html>
  )
}
