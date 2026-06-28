'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { cn } from '@/lib/utils'

interface RevealSectionProps {
  children: React.ReactNode
  className?: string
  delay?: 'none' | 'sm' | 'md' | 'lg'
}

const delays = {
  none: '',
  sm: 'reveal-delay-1',
  md: 'reveal-delay-2',
  lg: 'reveal-delay-3',
}

export function RevealSection({ children, className, delay = 'none' }: RevealSectionProps) {
  const ref = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={cn('reveal-section', delays[delay], className)}
    >
      {children}
    </section>
  )
}
