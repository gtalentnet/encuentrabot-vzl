import { Suspense } from 'react'
import { PersonasContent } from './personas-content'
import { PersonaCardSkeleton } from '@/components/personas/persona-card'

export default function PersonasPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
          {Array.from({ length: 6 }).map((_, i) => <PersonaCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <PersonasContent />
    </Suspense>
  )
}
