import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
          {
            'bg-[#FF6600] text-white hover:bg-orange-700 shadow-md shadow-orange-200': variant === 'primary',
            'bg-black text-white hover:bg-black/80': variant === 'secondary',
            'border-2 border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600] hover:text-white': variant === 'outline',
            'text-black/70 hover:text-black hover:bg-black/5': variant === 'ghost',
          },
          {
            'text-sm px-3 min-h-[36px]': size === 'sm',
            'text-sm px-4 min-h-[44px]': size === 'md',
            'text-base px-6 min-h-[52px]': size === 'lg',
            'text-lg px-8 min-h-[60px]': size === 'xl',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
