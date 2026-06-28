'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { reportarPersona, uploadFoto } from '@/lib/supabase'

type Step = 'form' | 'success'

export default function ReportarPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fotoPreview, setFotoPreview] = useState<string>('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    nombre_completo: '',
    edad: '',
    sexo: '',
    ultima_ubicacion: '',
    descripcion: '',
    contacto: '',
    reportado_por: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre_completo.trim()) { setError('El nombre es obligatorio.'); return }
    setError('')
    setLoading(true)
    try {
      const persona = await reportarPersona({
        nombre_completo: form.nombre_completo.trim(),
        edad: form.edad ? parseInt(form.edad) : undefined,
        sexo: (form.sexo as 'M' | 'F' | 'O') || undefined,
        ultima_ubicacion: form.ultima_ubicacion || undefined,
        descripcion: form.descripcion || undefined,
        contacto: form.contacto || undefined,
        reportado_por: form.reportado_por || undefined,
      })
      if (fotoFile && persona?.id) {
        try { await uploadFoto(fotoFile, persona.id) } catch {}
      }
      setStep('success')
    } catch (err) {
      setError('Ocurrió un error al enviar el reporte. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-black mb-3">Reporte enviado</h1>
        <p className="text-black/60 mb-8">
          El reporte ha sido registrado. Los coordinadores serán notificados. Gracias por ayudar.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push('/personas')}>Ver personas reportadas</Button>
          <Button variant="ghost" onClick={() => { setStep('form'); setForm({ nombre_completo:'',edad:'',sexo:'',ultima_ubicacion:'',descripcion:'',contacto:'',reportado_por:'' }); setFotoPreview(''); setFotoFile(null) }}>
            Reportar otra persona
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 bg-[#FF6600] rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-black">Reportar persona</h1>
          <p className="text-black/50 mt-1">Desaparecida o encontrada tras la emergencia.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="nombre_completo">
            Nombre completo <span className="text-[#FF6600]">*</span>
          </label>
          <input
            id="nombre_completo" name="nombre_completo" type="text" required
            value={form.nombre_completo} onChange={handleChange}
            placeholder="Juan Carlos Pérez"
            className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FF6600] transition-colors"
          />
        </div>

        {/* Edad y Sexo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" htmlFor="edad">Edad</label>
            <input
              id="edad" name="edad" type="number" min="0" max="120"
              value={form.edad} onChange={handleChange}
              placeholder="35"
              className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FF6600] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" htmlFor="sexo">Sexo</label>
            <select
              id="sexo" name="sexo"
              value={form.sexo} onChange={handleChange}
              className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FF6600] transition-colors bg-white"
            >
              <option value="">Sin especificar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
          </div>
        </div>

        {/* Última ubicación */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="ultima_ubicacion">
            Última ubicación conocida
          </label>
          <input
            id="ultima_ubicacion" name="ultima_ubicacion" type="text"
            value={form.ultima_ubicacion} onChange={handleChange}
            placeholder="Chacao, cerca del Metro de Caracas"
            className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FF6600] transition-colors"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="descripcion">
            Descripción física
          </label>
          <textarea
            id="descripcion" name="descripcion" rows={3}
            value={form.descripcion} onChange={handleChange}
            placeholder="Camisa roja, jeans azul, contextura delgada, cabello negro..."
            className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FF6600] transition-colors resize-none"
          />
        </div>

        {/* Foto */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Foto o video <span className="text-black/40 font-normal">(opcional)</span>
          </label>
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFoto} className="hidden" />
          {fotoPreview ? (
            <div className="relative rounded-xl overflow-hidden border-2 border-[#FF6600]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fotoPreview} alt="Vista previa" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => { setFotoPreview(''); setFotoFile(null) }}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full min-h-0"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-black/20 rounded-xl py-8 text-center hover:border-[#FF6600] transition-colors min-h-0 flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-black/30" aria-hidden="true" />
              <span className="text-sm text-black/50">Toca para subir una foto o video</span>
              <span className="text-xs text-black/30">JPG, PNG, MP4 · Máx 20MB</span>
            </button>
          )}
        </div>

        {/* Contacto */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="contacto">
            Teléfono de contacto
          </label>
          <input
            id="contacto" name="contacto" type="tel"
            value={form.contacto} onChange={handleChange}
            placeholder="0414-1234567"
            className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FF6600] transition-colors"
          />
        </div>

        {/* Reportado por */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="reportado_por">
            Tu nombre o @usuario de Telegram
          </label>
          <input
            id="reportado_por" name="reportado_por" type="text"
            value={form.reportado_por} onChange={handleChange}
            placeholder="María González o @mariag"
            className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FF6600] transition-colors"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" size="xl" loading={loading} className="w-full mt-2">
          {loading ? 'Enviando reporte...' : 'Enviar reporte'}
        </Button>

        <p className="text-xs text-center text-black/30 pb-4">
          Al enviar confirmas que la información es verídica. Datos protegidos por G-Talent Labs.
        </p>
      </form>
    </div>
  )
}
