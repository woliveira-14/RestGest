import { useState } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Form } from '@adonisjs/inertia/react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { formatDateTime } from '~/lib/format'
import { Pencil, Plus, Trash2 } from 'lucide-react'

type ReservationRow = {
  id: number
  customerName: string
  customerPhone: string
  customerEmail: string | null
  partySize: number
  reservedFor: string
  status: string
  notes: string | null
  restaurantTableId: number | null
  tableName: string
}

type TableOption = { id: number; name: string; capacity: number }

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendente',
  seated: 'Sentada',
  cancelled: 'Cancelada',
  no_show: 'Não compareceu',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  pending: 'secondary',
  seated: 'outline',
  cancelled: 'destructive',
  no_show: 'destructive',
}

export default function ReservationsIndex({
  reservations,
  tables,
}: {
  reservations: ReservationRow[]
  tables: TableOption[]
}) {
  const [showForm, setShowForm] = useState(reservations.length === 0)
  const [reservationBeingEdited, setReservationBeingEdited] = useState<ReservationRow | null>(null)

  return (
    <Page
      title="Reservas"
      description="Gerencie as reservas de mesas e evite conflitos de horário."
      actions={
        <Button onClick={() => setShowForm((value) => !value)}>
          <Plus size={16} /> Nova reserva
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nova reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              route="reservations.store"
              onSuccess={() => setShowForm(false)}
              resetOnSuccess
              className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {({ errors, processing }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="customerName">Cliente</Label>
                    <Input id="customerName" name="customerName" required />
                    {errors.customerName && (
                      <span className="text-xs text-destructive">{errors.customerName}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customerPhone">Telefone</Label>
                    <Input id="customerPhone" name="customerPhone" required />
                    {errors.customerPhone && (
                      <span className="text-xs text-destructive">{errors.customerPhone}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customerEmail">E-mail (opcional)</Label>
                    <Input id="customerEmail" name="customerEmail" type="email" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="partySize">Número de pessoas</Label>
                    <Input
                      id="partySize"
                      name="partySize"
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={2}
                      required
                    />
                    {errors.partySize && (
                      <span className="text-xs text-destructive">{errors.partySize}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reservedFor">Data e hora</Label>
                    <Input id="reservedFor" name="reservedFor" type="datetime-local" required />
                    {errors.reservedFor && (
                      <span className="text-xs text-destructive">{errors.reservedFor}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="restaurantTableId">Mesa (opcional)</Label>
                    <select
                      id="restaurantTableId"
                      name="restaurantTableId"
                      defaultValue=""
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="">A definir</option>
                      {tables.map((table) => (
                        <option key={table.id} value={table.id}>
                          {table.name} ({table.capacity} lugares)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea id="notes" name="notes" rows={2} />
                  </div>

                  <div className="flex items-end lg:col-span-1">
                    <Button type="submit" disabled={processing} className="w-full">
                      {processing ? 'Salvando…' : 'Confirmar reserva'}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Mesa</TableHead>
                <TableHead>Pessoas</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhuma reserva cadastrada.
                  </TableCell>
                </TableRow>
              )}
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <p className="font-medium">{reservation.customerName}</p>
                    <p className="text-xs text-muted-foreground">{reservation.customerPhone}</p>
                  </TableCell>
                  <TableCell>{reservation.tableName}</TableCell>
                  <TableCell>{reservation.partySize}</TableCell>
                  <TableCell>{formatDateTime(reservation.reservedFor)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_VARIANT[reservation.status] ?? 'outline'}>
                        {STATUS_LABEL[reservation.status] ?? reservation.status}
                      </Badge>
                      <Form route="reservations.update" routeParams={{ id: reservation.id }}>
                        {({ submit }) => (
                          <select
                            name="status"
                            defaultValue={reservation.status}
                            onChange={() => submit()}
                            className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs"
                          >
                            {Object.entries(STATUS_LABEL).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        )}
                      </Form>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setReservationBeingEdited(reservation)}
                        aria-label={`Editar reserva de ${reservation.customerName}`}
                        title="Editar reserva"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Form route="reservations.destroy" routeParams={{ id: reservation.id }}>
                        {({ processing }) => (
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon-sm"
                            disabled={processing}
                            className="text-destructive hover:text-destructive"
                            aria-label={`Remover reserva de ${reservation.customerName}`}
                            title="Remover reserva"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </Form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={reservationBeingEdited !== null}
        onOpenChange={(open) => {
          if (!open) setReservationBeingEdited(null)
        }}
      >
        {reservationBeingEdited && (
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar reserva</DialogTitle>
              <DialogDescription>
                Atualize os dados da reserva de {reservationBeingEdited.customerName}.
              </DialogDescription>
            </DialogHeader>

            <Form
              key={reservationBeingEdited.id}
              route="reservations.update"
              routeParams={{ id: reservationBeingEdited.id }}
              onSuccess={() => setReservationBeingEdited(null)}
              className="grid gap-x-5 gap-y-4 sm:grid-cols-2"
            >
              {({ errors, processing }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-customerName">Cliente</Label>
                    <Input
                      id="edit-customerName"
                      name="customerName"
                      defaultValue={reservationBeingEdited.customerName}
                      required
                    />
                    {errors.customerName && (
                      <span className="text-xs text-destructive">{errors.customerName}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-customerPhone">Telefone</Label>
                    <Input
                      id="edit-customerPhone"
                      name="customerPhone"
                      defaultValue={reservationBeingEdited.customerPhone}
                      required
                    />
                    {errors.customerPhone && (
                      <span className="text-xs text-destructive">{errors.customerPhone}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-customerEmail">E-mail</Label>
                    <Input
                      id="edit-customerEmail"
                      name="customerEmail"
                      type="email"
                      defaultValue={reservationBeingEdited.customerEmail ?? ''}
                    />
                    {errors.customerEmail && (
                      <span className="text-xs text-destructive">{errors.customerEmail}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-partySize">Número de pessoas</Label>
                    <Input
                      id="edit-partySize"
                      name="partySize"
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={reservationBeingEdited.partySize}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-reservedFor">Data e hora</Label>
                    <Input
                      id="edit-reservedFor"
                      name="reservedFor"
                      type="datetime-local"
                      defaultValue={reservationBeingEdited.reservedFor}
                      required
                    />
                    {errors.reservedFor && (
                      <span className="text-xs text-destructive">{errors.reservedFor}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-restaurantTableId">Mesa</Label>
                    <select
                      id="edit-restaurantTableId"
                      name="restaurantTableId"
                      defaultValue={reservationBeingEdited.restaurantTableId ?? ''}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="">A definir</option>
                      {tables.map((table) => (
                        <option key={table.id} value={table.id}>
                          {table.name} ({table.capacity} lugares)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-reservation-status">Status</Label>
                    <select
                      id="edit-reservation-status"
                      name="status"
                      defaultValue={reservationBeingEdited.status}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="edit-reservation-notes">Observações</Label>
                    <Textarea
                      id="edit-reservation-notes"
                      name="notes"
                      defaultValue={reservationBeingEdited.notes ?? ''}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setReservationBeingEdited(null)}
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

ReservationsIndex.layout = [AppLayout]
