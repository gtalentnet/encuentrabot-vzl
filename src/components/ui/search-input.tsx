'use client'

import { Search, X } from 'lucide-react'
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void
  size?: 'md' | 'lg' | 'hero'
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, size = 'md', value, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <Search
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-[#FF6600] transition-colors',
            size === 'hero' ? 'w-6 h-6' : 'w-5 h-5'
          )}
          aria-hidden="true"
        />
        <input
          ref={ref}
          value={value}
          className={cn(
            'w-full bg-white border-2 border-black/10 rounded-2xl font-medium placeholder:text-black/30',
            'focus:outline-none focus:border-[#FF6600] transition-colors',
            size === 'hero'
              ? 'pl-14 pr-14 py-5 text-xl'
              : size === 'lg'
              ? 'pl-12 pr-12 py-4 text-base'
              : 'pl-10 pr-10 py-3 text-sm',
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors rounded-full p-0.5 min-h-0',
            )}
            aria-label="Limpiar búsqueda"
          >
            <X className={size === 'hero' ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'
