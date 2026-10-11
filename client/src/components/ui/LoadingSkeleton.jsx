import { cn } from '../../lib/utils'

function SkeletonBox({ className }) {
  return (
    <div
      className={cn('rounded bg-slate-200 animate-pulse', className)}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
      <SkeletonBox className="h-4 w-1/3" />
      <SkeletonBox className="h-8 w-1/2" />
      <SkeletonBox className="h-3 w-2/3" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-7 w-32" />
        </div>
        <SkeletonBox className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 px-4 bg-white rounded-lg border border-slate-100">
          <SkeletonBox className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-3.5 w-1/3" />
            <SkeletonBox className="h-3 w-1/4" />
          </div>
          <SkeletonBox className="h-5 w-16" />
          <SkeletonBox className="h-5 w-20" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex justify-between">
            <SkeletonBox className="h-4 w-1/3" />
            <SkeletonBox className="h-5 w-16 rounded-full" />
          </div>
          <SkeletonBox className="h-3 w-2/3" />
          <SkeletonBox className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default CardSkeleton
