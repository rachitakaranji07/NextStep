import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700',
        emerald: 'bg-emerald-100 text-emerald-700',
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        orange: 'bg-orange-100 text-orange-700',
        red: 'bg-red-100 text-red-700',
        purple: 'bg-purple-100 text-purple-700',
        pink: 'bg-pink-100 text-pink-700',
        sky: 'bg-sky-100 text-sky-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Badge({ children, variant, className, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}

// Status-specific badge helper
const STATUS_MAP = {
  // Job application statuses
  applied: { variant: 'blue', label: 'Applied' },
  screening: { variant: 'purple', label: 'Screening' },
  interview: { variant: 'yellow', label: 'Interview' },
  offer: { variant: 'emerald', label: 'Offer' },
  rejected: { variant: 'red', label: 'Rejected' },
  withdrawn: { variant: 'default', label: 'Withdrawn' },
  // Career goal statuses
  active: { variant: 'emerald', label: 'Active' },
  completed: { variant: 'green', label: 'Completed' },
  paused: { variant: 'yellow', label: 'Paused' },
  // Transaction types
  income: { variant: 'emerald', label: 'Income' },
  expense: { variant: 'red', label: 'Expense' },
  // Milestone/task statuses
  pending: { variant: 'default', label: 'Pending' },
  'in-progress': { variant: 'blue', label: 'In Progress' },
  done: { variant: 'green', label: 'Done' },
}

export function StatusBadge({ status, className }) {
  const config = STATUS_MAP[status] || { variant: 'default', label: status }
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

export default Badge
