import { useState } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Form } from '@adonisjs/inertia/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'

type Table = {
  id: number
  name: string
  capacity: number
  area: string
  status: string
  notes: string | null
}

const STATUS_LABEL: Record<string, string> = {
  available: 'Disponível',
  occupied: 'Ocupada',
  reserved: 'Reservada',
  maintenance: 'Manutenção',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  available: 'outline',
  occupied: 'default',
  reserved: 'secondary',
  maintenance: 'destructive',
}

export default function TablesIndex({ tables }: { tables: Table[] }) {
  const [showForm, setShowForm] = useState(tables.length === 0)

  return (
    <Page
      title="Mesas"
      description="Controle a disposição do salão, capacidade e disponibilidade das mesas."
      actions={
        <Button onClick={() => setShowForm((value) => !value)}>
          <Plus size={16} /> Nova mesa
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cadastrar mesa</CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              route="tables.store"
              onSuccess={() => setShowForm(false)}
              resetOnSuccess
              className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {({ errors, processing }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Identificação</Label>
                    <Input id="name" name="name" placeholder="Mesa 01" required />
                    {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Capacidade</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min={1}
                      max={50}
                      defaultValue={4}
                      required
                    />
                    {errors.capacity && (
                      <span className="text-xs text-destructive">{errors.capacity}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="area">Área</Label>
                    <Input
                      id="area"
                      name="area"
                      defaultValue="Salão principal"
                      placeholder="Varanda, Mezanino…"
                      required
                    />
                    {errors.area && <span className="text-xs text-destructive">{errors.area}</span>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Situação</Label>
                    <select
                      id="status"
                      name="status"
                      defaultValue="available"
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea id="notes" name="notes" rows={2} placeholder="Opcional" />
                  </div>

                  <div className="flex items-end">
                    <Button type="submit" disabled={processing} className="w-full">
                      {processing ? 'Salvando…' : 'Salvar mesa'}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {tables.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma mesa cadastrada. Comece criando a primeira mesa do salão.
          </p>
        )}

        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{table.name}</CardTitle>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {table.area} · {table.capacity} lugares
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[table.status] ?? 'outline'}>
                {STATUS_LABEL[table.status] ?? table.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {table.notes && <p className="text-sm text-muted-foreground">{table.notes}</p>}

              <Form route="tables.update" routeParams={{ id: table.id }} className="flex gap-2">
                {({ processing }) => (
                  <>
                    <select
                      name="status"
                      defaultValue={table.status}
                      className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary" size="sm" disabled={processing}>
                      Atualizar
                    </Button>
                  </>
                )}
              </Form>

              <Form route="tables.destroy" routeParams={{ id: table.id }}>
                {({ processing }) => (
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    disabled={processing}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} /> Remover
                  </Button>
                )}
              </Form>
            </CardContent>
          </Card>
        ))}
      </div>
    </Page>
  )
}

TablesIndex.layout = [AppLayout]
