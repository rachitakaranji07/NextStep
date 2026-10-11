import { cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm',
        secondary:
          'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-500',
        outline:
          'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
        ghost:
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export function Button({
  children,
  className,
  variant,
  size,
  isLoading = false,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
