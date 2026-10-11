import { cn } from '../../lib/utils'

export function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  className,
  barClassName,
  size = 'md',
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const getColor = () => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-medium text-slate-700">
            {Math.round(percent)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-slate-100 overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={cn(
            'rounded-full transition-all duration-500 ease-out',
            getColor(),
            barClassName,
            heights[size]
          )}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}

export default ProgressBar
