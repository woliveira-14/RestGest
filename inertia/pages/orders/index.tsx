import { useMemo, useState } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Form, useRouter } from '@adonisjs/inertia/react'
import { z } from 'zod'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { formatCurrency, formatDateTime } from '~/lib/format'
import { createOrderSchema, type OrderItemInput } from '~/lib/validation/order'
import { Minus, Pencil, Plus, ShoppingCart, Trash2 } from 'lucide-react'

type Order = {
  id: number
  table: string
  restaurantTableId: number | null
  customerName: string | null
  type: string
  status: string
  subtotal: number
  serviceCharge: number
  total: number
  notes: string | null
  openedAt: string
  items: { id: number; name: string; quantity: number; unitPrice: number; total: number }[]
}

type TableOption = { id: number; name: string }
type MenuOption = { id: number; name: string; price: number; category: string }

const STATUS_LABEL: Record<string, string> = {
  open: 'Aberto',
  preparing: 'Em preparo',
  ready: 'Pronto',
  served: 'Servido',
  paid: 'Pago',
  cancelled: 'Cancelado',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  open: 'secondary',
  preparing: 'default',
  ready: 'outline',
  served: 'outline',
  paid: 'default',
  cancelled: 'destructive',
}

export default function OrdersIndex({
  orders,
  tables,
  menuItems,
}: {
  orders: Order[]
  tables: TableOption[]
  menuItems: MenuOption[]
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(orders.length === 0)
  const [selectedTableId, setSelectedTableId] = useState('')
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('')
  const [items, setItems] = useState<OrderItemInput[]>([])
  const [clientError, setClientError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [orderBeingEdited, setOrderBeingEdited] = useState<Order | null>(null)

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items]
  )
  const activeOrderForSelectedTable = useMemo(
    () =>
      orders.find(
        (order) =>
          order.restaurantTableId === Number(selectedTableId) &&
          !['paid', 'cancelled'].includes(order.status)
      ),
    [orders, selectedTableId]
  )

  function addItem() {
    const menuItem = menuItems.find((item) => item.id === Number(selectedMenuItemId))
    if (!menuItem) return

    setItems((current) => {
      const existing = current.find((item) => item.menuItemId === menuItem.id)
      if (existing) {
        return current.map((item) =>
          item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [
        ...current,
        {
          menuItemId: menuItem.id,
          itemName: menuItem.name,
          quantity: 1,
          unitPrice: menuItem.price,
        },
      ]
    })
    setSelectedMenuItemId('')
    setClientError(null)
  }

  function updateQuantity(index: number, delta: number) {
    setItems((current) =>
      current
        .map((item, itemIndex) =>
          itemIndex === index ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function handleOrderSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    /**
     * `event.currentTarget` is nulled out by React once the synthetic event is
     * released, so the element is captured up-front for the async callbacks.
     */
    const formElement = event.currentTarget
    const data = new FormData(formElement)
    const restaurantTableId = data.get('restaurantTableId')
    const customerName = String(data.get('customerName') ?? '').trim()
    const notes = String(data.get('notes') ?? '').trim()
    const serviceCharge = Number(data.get('serviceCharge') || 0)

    const parsed = createOrderSchema.safeParse({
      restaurantTableId: restaurantTableId ? Number(restaurantTableId) : undefined,
      customerName: customerName || undefined,
      type: String(data.get('type') || 'dine_in'),
      serviceCharge,
      notes: notes || undefined,
      items,
    })

    if (!parsed.success) {
      setClientError(z.prettifyError(parsed.error))
      return
    }

    setSubmitting(true)
    router.post({ route: 'orders.store' }, parsed.data, {
      onSuccess: () => {
        setItems([])
        setShowForm(false)
        setClientError(null)
        setSelectedTableId('')
        formElement.reset()
      },
      onFinish: () => setSubmitting(false),
    })
  }

  return (
    <Page
      title="Pedidos"
      description="Abra comandas, acompanhe o preparo e finalize o atendimento."
      actions={
        <Button onClick={() => setShowForm((value) => !value)}>
          <ShoppingCart size={16} /> Novo pedido
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {activeOrderForSelectedTable ? 'Adicionar à comanda' : 'Abrir pedido'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrderSubmit} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="restaurantTableId">Mesa</Label>
                  <select
                    id="restaurantTableId"
                    name="restaurantTableId"
                    value={selectedTableId}
                    onChange={(event) => setSelectedTableId(event.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Balcão / retirada</option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                  {activeOrderForSelectedTable && (
                    <p className="text-xs text-muted-foreground">
                      Os itens serão acrescentados à comanda #{activeOrderForSelectedTable.id}.
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    name="type"
                    defaultValue="dine_in"
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="dine_in">No salão</option>
                    <option value="takeaway">Retirada</option>
                    <option value="delivery">Entrega</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerName">Cliente (opcional)</Label>
                  <Input id="customerName" name="customerName" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serviceCharge">Taxa de serviço</Label>
                  <Input
                    id="serviceCharge"
                    name="serviceCharge"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={0}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" name="notes" rows={2} />
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex gap-2">
                  <select
                    value={selectedMenuItemId}
                    onChange={(event) => setSelectedMenuItemId(event.target.value)}
                    className="h-9 min-w-0 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Adicionar item do cardápio…</option>
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.category} · {item.name} — {formatCurrency(item.price)}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addItem}
                    disabled={!selectedMenuItemId}
                  >
                    Adicionar
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  {items.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Selecione ao menos um item do cardápio.
                    </p>
                  )}
                  {items.map((item, index) => (
                    <div
                      key={`${item.menuItemId}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-md bg-muted/50 p-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.unitPrice)} cada
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => updateQuantity(index, -1)}
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-5 text-center text-sm">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          <Plus size={12} />
                        </Button>
                        <span className="w-18 text-right text-sm font-medium">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="font-medium">Subtotal</span>
                  <span className="text-lg font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {clientError && (
                  <p className="mt-3 whitespace-pre-line text-sm text-destructive">{clientError}</p>
                )}
                <Button type="submit" disabled={submitting} className="mt-4 w-full">
                  {submitting
                    ? 'Salvando…'
                    : activeOrderForSelectedTable
                      ? `Adicionar à comanda #${activeOrderForSelectedTable.id}`
                      : 'Abrir pedido'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum pedido registrado ainda.</p>
        )}
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>
                  Pedido #{order.id} · {order.table}
                </CardTitle>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {order.customerName ?? 'Cliente não identificado'} ·{' '}
                  {formatDateTime(order.openedAt)}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'}>
                {STATUS_LABEL[order.status] ?? order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{formatCurrency(item.total)}</span>
                      {order.status !== 'paid' && order.status !== 'cancelled' && (
                        <Form
                          route="orders.items.destroy"
                          routeParams={{ orderId: order.id, itemId: item.id }}
                        >
                          {({ processing }) => (
                            <Button
                              type="submit"
                              variant="destructive"
                              size="xs"
                              disabled={processing}
                              aria-label={`Remover ${item.name} da comanda`}
                              title="Remover item da comanda"
                            >
                              <Trash2 size={13} />
                              {processing ? 'Removendo…' : 'Remover'}
                            </Button>
                          )}
                        </Form>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold">{formatCurrency(order.total)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOrderBeingEdited(order)}
                >
                  <Pencil size={14} /> Editar pedido
                </Button>
                {order.status !== 'paid' && order.status !== 'cancelled' && (
                  <Form route="orders.status" routeParams={{ id: order.id }}>
                    {({ processing }) => (
                      <>
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                        >
                          {Object.entries(STATUS_LABEL)
                            .filter(([value]) => value !== 'cancelled')
                            .map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                        </select>
                        <Button
                          type="submit"
                          variant="secondary"
                          size="sm"
                          disabled={processing}
                          className="ml-2"
                        >
                          Atualizar status
                        </Button>
                      </>
                    )}
                  </Form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={orderBeingEdited !== null}
        onOpenChange={(open) => {
          if (!open) setOrderBeingEdited(null)
        }}
      >
        {orderBeingEdited && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Editar comanda #{orderBeingEdited.id}</DialogTitle>
              <DialogDescription>
                Atualize os dados gerais do pedido. Os itens da comanda permanecem preservados.
              </DialogDescription>
            </DialogHeader>

            <Form
              key={orderBeingEdited.id}
              route="orders.update"
              routeParams={{ id: orderBeingEdited.id }}
              onSuccess={() => setOrderBeingEdited(null)}
              className="grid gap-x-5 gap-y-4 sm:grid-cols-2"
            >
              {({ errors, processing }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-order-customerName">Cliente</Label>
                    <Input
                      id="edit-order-customerName"
                      name="customerName"
                      defaultValue={orderBeingEdited.customerName ?? ''}
                      placeholder="Cliente não identificado"
                    />
                    {errors.customerName && (
                      <span className="text-xs text-destructive">{errors.customerName}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-order-type">Tipo</Label>
                    <select
                      id="edit-order-type"
                      name="type"
                      defaultValue={orderBeingEdited.type}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="dine_in">No salão</option>
                      <option value="takeaway">Retirada</option>
                      <option value="delivery">Entrega</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-order-serviceCharge">Taxa de serviço</Label>
                    <Input
                      id="edit-order-serviceCharge"
                      name="serviceCharge"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={orderBeingEdited.serviceCharge}
                    />
                    {errors.serviceCharge && (
                      <span className="text-xs text-destructive">{errors.serviceCharge}</span>
                    )}
                  </div>
                  <div className="rounded-md border bg-muted/40 p-3 text-sm">
                    <span className="text-muted-foreground">Total atual</span>
                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(orderBeingEdited.total)}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="edit-order-notes">Observações</Label>
                    <Textarea
                      id="edit-order-notes"
                      name="notes"
                      defaultValue={orderBeingEdited.notes ?? ''}
                      rows={3}
                    />
                    {errors.notes && (
                      <span className="text-xs text-destructive">{errors.notes}</span>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOrderBeingEdited(null)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={processing}>
                      {processing ? 'Salvando…' : 'Salvar alterações'}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </DialogContent>
        )}
      </Dialog>
    </Page>
  )
}

OrdersIndex.layout = [AppLayout]
