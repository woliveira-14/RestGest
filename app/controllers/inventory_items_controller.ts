import InventoryItem from '#models/inventory_item'
import {
  createInventoryItemValidator,
  stockMovementValidator,
  updateInventoryItemValidator,
} from '#validators/inventory_item'
import type { HttpContext } from '@adonisjs/core/http'

export default class InventoryItemsController {
  async index({ inertia }: HttpContext) {
    const items = await InventoryItem.query().orderBy('name', 'asc')

    return inertia.render('inventory/index', {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        currentQuantity: Number(item.currentQuantity),
        minimumQuantity: Number(item.minimumQuantity),
        unitCost: Number(item.unitCost),
        supplier: item.supplier,
        expiresAt: item.expiresAt ? item.expiresAt.toFormat('yyyy-MM-dd') : null,
        isLowStock: item.isLowStock,
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    await InventoryItem.create(await request.validateUsing(createInventoryItemValidator))
    session.flash('success', 'Insumo cadastrado no estoque.')
    return response.redirect().toRoute('inventory.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const item = await InventoryItem.findOrFail(params.id)
    item.merge(await request.validateUsing(updateInventoryItemValidator))
    await item.save()
    session.flash('success', 'Insumo atualizado.')
    return response.redirect().toRoute('inventory.index')
  }

  /**
   * Quick stock in/out movement used by the "+/-" buttons on the inventory page.
   */
  async move({ params, request, response, session }: HttpContext) {
    const item = await InventoryItem.findOrFail(params.id)
    const { quantity, operation } = await request.validateUsing(stockMovementValidator)

    const delta = operation === 'increase' ? quantity : -quantity
    item.currentQuantity = Math.max(0, Number(item.currentQuantity) + delta)
    await item.save()

    session.flash('success', 'Estoque movimentado.')
    return response.redirect().toRoute('inventory.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const item = await InventoryItem.findOrFail(params.id)
    await item.delete()
    session.flash('success', 'Insumo removido.')
    return response.redirect().toRoute('inventory.index')
  }
}
