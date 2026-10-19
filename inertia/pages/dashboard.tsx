import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import StatCard from '~/components/stat_card'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Link } from '@adonisjs/inertia/react'
import { formatCurrency, formatDateTime, formatQuantity } from '~/lib/format'
import { Banknote, ClipboardList, CookingPot, PackageSearch, Utensils } from 'lucide-react'

type Metrics = {
  revenue: number
  activeOrders: number
  todaysReservations: number
  occupiedTables: number
  totalTables: number
  lowStockItems: number
}

type RecentOrder = {
  id: number
  table: string
  customerName: string | null
  status: string
  total: number
  openedAt: string
}

type UpcomingReservation = {
  id: number
  customerName: string
  partySize: number
  table: string
  status: string
  reservedFor: string
}

type LowStock = {
  id: number
  name: string
  currentQuantity: number
  minimumQuantity: number
  unit: string
}

export default function Dashboard({
  metrics,
  recentOrders,
  upcomingReservations,
  lowStock,
}: {
  metrics: Metrics
  recentOrders: RecentOrder[]
  upcomingReservations: UpcomingReservation[]
  lowStock: LowStock[]
}) {
  return (
    <Page title="Dashboard" description="Visão geral das operações do restaurante em tempo real.">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Faturamento (pedidos pagos)"
          value={formatCurrency(metrics.revenue)}
          icon={Banknote}
          tone="success"
        />
        <StatCard
          label="Pedidos em andamento"
          value={String(metrics.activeOrders)}
          icon={CookingPot}
        />
        <StatCard
          label="Reservas de hoje"
          value={String(metrics.todaysReservations)}
          icon={ClipboardList}
        />
        <StatCard
          label="Mesas ocupadas"
          value={`${metrics.occupiedTables} / ${metrics.totalTables}`}
          icon={Utensils}
        />
        <StatCard
          label="Itens em estoque baixo"
          value={String(metrics.lowStockItems)}
          icon={PackageSearch}
          tone={metrics.lowStockItems > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Pedidos em andamento</CardTitle>
            <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum pedido em aberto no momento.</p>
            )}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    Pedido #{order.id} · {order.table}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerName ?? 'Cliente não identificado'} ·{' '}
                    {formatDateTime(order.openedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{order.status}</Badge>
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas de hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingReservations.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma reserva para hoje.</p>
            )}
            {upcomingReservations.map((reservation) => (
              <div key={reservation.id} className="rounded-lg border p-4">
                <p className="font-medium">{reservation.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {reservation.partySize} pessoas · {reservation.table}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(reservation.reservedFor)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {lowStock.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Itens com estoque baixo</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Mínimo: {formatQuantity(item.minimumQuantity, item.unit)}
                  </p>
                </div>
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  {formatQuantity(item.currentQuantity, item.unit)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </Page>
  )
}

Dashboard.layout = [AppLayout]
