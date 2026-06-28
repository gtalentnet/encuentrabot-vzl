'use client'

import { useCounter } from '@/hooks/use-counter'
import { LucideIcon } from 'lucide-react'

interface AnimatedStatProps {
  icon: LucideIcon
  label: string
  value: number
  color: string
}

export function AnimatedStat({ icon: Icon, label, value, color }: AnimatedStatProps) {
  const { count, ref } = useCounter(value)

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="stat-card text-center p-4 rounded-xl">
      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} aria-hidden="true" />
      <p className={`text-4xl font-black tabular-nums ${color}`}>{count.toLocaleString()}</p>
      <p className="text-sm text-black/50 mt-1">{label}</p>
    </div>
  )
}
