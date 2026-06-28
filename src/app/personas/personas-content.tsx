'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'
import { Button } from '@/components/ui/button'
import { PersonaCard, PersonaCardSkeleton } from '@/components/personas/persona-card'
import { buscarPersonas, getPersonas } from '@/lib/supabase'
import type { Persona, EstadoPersona } from '@/lib/types'

const ESTADOS: { value: EstadoPersona | ''; label: string }[] = [
  { value: '',             label: 'Todos' },
  { value: 'Desaparecido', label: 'Desaparecidos' },
  { value: 'Encontrado',   label: 'Encontrados' },
  { value: 'Reunificado',  label: 'Reunificados' },
]

export function PersonasContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qParam = searchParams.get('q') ?? ''

  const [query, setQuery]       = useState(qParam)
  const [estado, setEstado]     = useState<EstadoPersona | ''>('')
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading]   = useState(true)

  const fetchPersonas = useCallback(async (q: string, e: string) => {
    setLoading(true)
    try {
      const data = q.trim()
        ? await buscarPersonas(q)
        : await getPersonas(e || undefined)
      setPersonas(data ?? [])
    } catch {
      setPersonas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPersonas(qParam, estado) }, [qParam, estado, fetchPersonas])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(query.trim() ? `/personas?q=${encodeURIComponent(query.trim())}` : '/personas')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Personas reportadas</h1>
        <p className="text-black/50">Busca por nombre o filtra por estado.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <SearchInput
          size="lg"
          placeholder="Buscar por nombre..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onClear={() => { setQuery(''); router.push('/personas') }}
        />
        <Button type="submit" size="lg" className="flex-shrink-0">Buscar</Button>
      </form>

      <div className="flex gap-2 mb-8 flex-wrap">
        {ESTADOS.map(e => (
          <button
            key={e.value}
            onClick={() => setEstado(e.value as EstadoPersona | '')}
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all min-h-[44px] ${
              estado === e.value
                ? 'bg-black text-white border-black'
                : 'bg-white text-black/60 border-black/10 hover:border-black/30'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-black/40">
          {!loading && `${personas.length} resultado${personas.length !== 1 ? 's' : ''}`}
        </p>
        <Button variant="primary" size="md" onClick={() => router.push('/reportar')}>
          <Users className="w-4 h-4" aria-hidden="true" />
          Reportar persona
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <PersonaCardSkeleton key={i} />)}
        </div>
      ) : personas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-xl font-bold mb-2">Sin resultados</p>
          <p className="text-black/50 mb-6">No encontramos personas con ese nombre. Puedes reportarla.</p>
          <Button onClick={() => router.push('/reportar')}>Reportar persona desaparecida</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map(p => <PersonaCard key={p.id} persona={p} />)}
        </div>
      )}
    </div>
  )
}
