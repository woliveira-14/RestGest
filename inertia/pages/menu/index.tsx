import { useMemo, useState } from 'react'
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
import { formatCurrency } from '~/lib/format'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'

type MenuItem = {
  id: number
  name: string
  description: string | null
  category: string
  price: number
  isAvailable: boolean
}

export default function MenuIndex({ items }: { items: MenuItem[] }) {
  const [showForm, setShowForm] = useState(items.length === 0)
  const [search, setSearch] = useState('')
  const [itemBeingEdited, setItemBeingEdited] = useState<MenuItem | null>(null)

  const visibleItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')
    if (!query) return items
    return items.filter(
      (item) =>
        item.name.toLocaleLowerCase('pt-BR').includes(query) ||
        item.category.toLocaleLowerCase('pt-BR').includes(query)
    )
  }, [items, search])

  const categories = [...new Set(visibleItems.map((item) => item.category))]

  return (
    <Page
      title="Cardápio"
      description="Organize pratos, categorias, preços e disponibilidade para os pedidos."
      actions={
        <Button onClick={() => setShowForm((value) => !value)}>
          <Plus size={16} /> Novo item
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adicionar item ao cardápio</CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              route="menu.store"
              onSuccess={() => setShowForm(false)}
              resetOnSuccess
              className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {({ errors, processing }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" required />
                    {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue="Pratos principais"
                      required
                    />
                    {errors.category && (
                      <span className="text-xs text-destructive">{errors.category}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input id="price" name="price" type="number" min="0.01" step="0.01" required />
                    {errors.price && (
                      <span className="text-xs text-destructive">{errors.price}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="isAvailable">Disponibilidade</Label>
                    <select
                      id="isAvailable"
                      name="isAvailable"
                      defaultValue="true"
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="true">Disponível</option>
                      <option value="false">Indisponível</option>
                    </select>
                  </div>
                  <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" name="description" rows={2} />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={processing} className="w-full">
                      {processing ? 'Salvando…' : 'Salvar item'}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar prato ou categoria…"
          className="pl-9"
        />
      </div>

      <div className="space-y-8">
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum item encontrado no cardápio.</p>
        )}
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item.id} className={!item.isAvailable ? 'opacity-60' : undefined}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                      <div>
                        <CardTitle>{item.name}</CardTitle>
                        <p className="mt-3 text-2xl font-semibold">{formatCurrency(item.price)}</p>
                      </div>
                      <Badge variant={item.isAvailable ? 'outline' : 'secondary'}>
                        {item.isAvailable ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="min-h-10 text-sm text-muted-foreground">
                        {item.description ?? 'Sem descrição.'}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <Form route="menu.update" routeParams={{ id: item.id }}>
                          {({ processing }) => (
                            <>
                              <input
                                type="hidden"
                                name="isAvailable"
                                value={String(!item.isAvailable)}
                              />
                              <Button
                                type="submit"
                                variant="secondary"
                                size="sm"
                                disabled={processing}
                              >
                                {item.isAvailable ? 'Pausar item' : 'Disponibilizar'}
                              </Button>
                            </>
                          )}
                        </Form>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setItemBeingEdited(item)}
                            aria-label={`Editar ${item.name}`}
                            title="Editar item"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Form route="menu.destroy" routeParams={{ id: item.id }}>
                            {({ processing }) => (
                              <Button
                                type="submit"
                                variant="ghost"
                                size="icon-sm"
                                disabled={processing}
                                className="text-destructive hover:text-destructive"
                                aria-label={`Remover ${item.name}`}
                                title="Remover item"
                              >
                                <Trash2 size={14} />
                              </Button>
                            )}
                          </Form>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        ))}
      </div>

      <Dialog
        open={itemBeingEdited !== null}
        onOpenChange={(open) => {
          if (!open) setItemBeingEdited(null)
        }}
      >
        {itemBeingEdited && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Alterar item do cardápio</DialogTitle>
              <DialogDescription>
                Atualize nome, categoria, preço, descrição ou disponibilidade de{' '}
                <strong>{itemBeingEdited.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <Form
              key={itemBeingEdited.id}
              route="menu.update"
              routeParams={{ id: itemBeingEdited.id }}
              onSuccess={() => setItemBeingEdited(null)}
              className="grid gap-x-5 gap-y-4 sm:grid-cols-2"
            >
              {({ errors, processing }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Nome</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      defaultValue={itemBeingEdited.name}
                      required
                    />
                    {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Categoria</Label>
                    <Input
                      id="edit-category"
                      name="category"
                      defaultValue={itemBeingEdited.category}
                      required
                    />
                    {errors.category && (
                      <span className="text-xs text-destructive">{errors.category}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Preço</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={itemBeingEdited.price}
                      required
                    />
                    {errors.price && (
                      <span className="text-xs text-destructive">{errors.price}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-isAvailable">Disponibilidade</Label>
                    <select
                      id="edit-isAvailable"
                      name="isAvailable"
                      defaultValue={String(itemBeingEdited.isAvailable)}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="true">Disponível</option>
                      <option value="false">Indisponível</option>
                    </select>
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      defaultValue={itemBeingEdited.description ?? ''}
                      rows={3}
                    />
                    {errors.description && (
                      <span className="text-xs text-destructive">{errors.description}</span>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setItemBeingEdited(null)}
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

MenuIndex.layout = [AppLayout]
