import { type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from 'cn'

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  icon: LucideIcon
  hint?: string
  tone?: 'default' | 'warning' | 'success'
}) {
  return (
    <Card className="gap-3">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-md',
            tone === 'warning' && 'bg-amber-500/15 text-amber-600',
            tone === 'success' && 'bg-emerald-500/15 text-emerald-600',
            tone === 'default' && 'bg-accent text-foreground'
          )}
        >
          <Icon size={16} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}
