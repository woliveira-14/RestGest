import { useState } from 'react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Form } from '@adonisjs/inertia/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { formatCurrency, formatDate, formatQuantity } from '~/lib/format'
import { Minus, Plus, Trash2 } from 'lucide-react'

type InventoryRow = {
  id: number
  name: string
  unit: string
  currentQuantity: number
  minimumQuantity: number
  unitCost: number
  supplier: string | null
  expiresAt: string | null
  isLowStock: boolean
}

export default function InventoryIndex({ items }: { items: InventoryRow[] }) {
  const [showForm, setShowForm] = useState(items.length === 0)

  return (
    <Page
      title="Estoque"
      description="Acompanhe insumos, níveis mínimos e movimentações de entrada e saída."
      actions={
        <Button onClick={() => setShowForm((value) => !value)}>
          <Plus size={16} /> Novo insumo
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cadastrar insumo</CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              route="inventory.store"
              onSuccess={() => setShowForm(false)}
              resetOnSuccess
              className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {({ errors, processing }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Insumo</Label>
                    <Input id="name" name="name" required />
                    {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unidade</Label>
                    <Input id="unit" name="unit" placeholder="kg, un, L…" required />
                    {errors.unit && <span className="text-xs text-destructive">{errors.unit}</span>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currentQuantity">Quantidade atual</Label>
                    <Input
                      id="currentQuantity"
                      name="currentQuantity"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minimumQuantity">Estoque mínimo</Label>
                    <Input
                      id="minimumQuantity"
                      name="minimumQuantity"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unitCost">Custo unitário</Label>
                    <Input
                      id="unitCost"
                      name="unitCost"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={0}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Fornecedor</Label>
                    <Input id="supplier" name="supplier" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiresAt">Validade</Label>
                    <Input id="expiresAt" name="expiresAt" type="date" />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={processing} className="w-full">
                      {processing ? 'Salvando…' : 'Salvar insumo'}
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
                <TableHead>Insumo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Custo unitário</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead className="text-right">Movimentação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum insumo cadastrado.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    {item.isLowStock && (
                      <Badge variant="destructive" className="mt-1">
                        Estoque baixo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatQuantity(item.currentQuantity, item.unit)}</TableCell>
                  <TableCell>{formatQuantity(item.minimumQuantity, item.unit)}</TableCell>
                  <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                  <TableCell>{item.supplier ?? '—'}</TableCell>
                  <TableCell>{formatDate(item.expiresAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Form route="inventory.move" routeParams={{ id: item.id }}>
                        {({ processing }) => (
                          <>
                            <input type="hidden" name="operation" value="increase" />
                            <input type="hidden" name="quantity" value="1" />
                            <Button
                              type="submit"
                              variant="outline"
                              size="icon-sm"
                              disabled={processing}
                            >
                              <Plus size={14} />
                            </Button>
                          </>
                        )}
                      </Form>
                      <Form route="inventory.move" routeParams={{ id: item.id }}>
                        {({ processing }) => (
                          <>
                            <input type="hidden" name="operation" value="decrease" />
                            <input type="hidden" name="quantity" value="1" />
                            <Button
                              type="submit"
                              variant="outline"
                              size="icon-sm"
                              disabled={processing}
                            >
                              <Minus size={14} />
                            </Button>
                          </>
                        )}
                      </Form>
                      <Form route="inventory.destroy" routeParams={{ id: item.id }}>
                        {({ processing }) => (
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon-sm"
                            disabled={processing}
                            className="text-destructive hover:text-destructive"
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

          <table className="mt-6 w-full text-sm">
            <tbody>
              <tr>
                <td className="font-medium">Total de insumos</td>
                <td className="text-right">{items.length}</td>
              </tr>
              <tr>
                <td className="font-medium">Valor total em estoque</td>
                <td className="text-right">
                  {formatCurrency(
                    items.reduce((total, item) => total + item.currentQuantity * item.unitCost, 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Page>
  )
}

InventoryIndex.layout = [AppLayout]
