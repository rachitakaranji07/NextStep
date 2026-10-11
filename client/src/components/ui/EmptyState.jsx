import { cn } from '../../lib/utils'
import Button from './Button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <Icon className="h-7 w-7 text-emerald-600" />
        </div>
      )}
      <h3 className="mb-2 text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
