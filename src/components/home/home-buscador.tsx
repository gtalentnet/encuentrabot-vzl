'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { SearchInput } from '@/components/ui/search-input'
import { Button } from '@/components/ui/button'

export function HomeBuscador() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/personas?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mx-auto w-full">
      <SearchInput
        size="hero"
        placeholder="Nombre de la persona..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onClear={() => setQuery('')}
        className="shadow-xl shadow-white/5"
        aria-label="Buscar persona desaparecida"
        autoFocus
      />
      <Button type="submit" size="lg" className="flex-shrink-0 shadow-xl shadow-orange-500/30">
        Buscar
      </Button>
    </form>
  )
}
