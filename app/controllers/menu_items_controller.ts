import MenuItem from '#models/menu_item'
import { createMenuItemValidator, updateMenuItemValidator } from '#validators/menu_item'
import type { HttpContext } from '@adonisjs/core/http'

export default class MenuItemsController {
  async index({ inertia }: HttpContext) {
    const items = await MenuItem.query().orderBy('category', 'asc').orderBy('name', 'asc')

    return inertia.render('menu/index', {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        price: Number(item.price),
        isAvailable: item.isAvailable,
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    await MenuItem.create(await request.validateUsing(createMenuItemValidator))
    session.flash('success', 'Item adicionado ao cardápio.')
    return response.redirect().toRoute('menu.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    item.merge(await request.validateUsing(updateMenuItemValidator))
    await item.save()
    session.flash('success', 'Item do cardápio atualizado.')
    return response.redirect().toRoute('menu.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const item = await MenuItem.findOrFail(params.id)
    await item.delete()
    session.flash('success', 'Item removido do cardápio.')
    return response.redirect().toRoute('menu.index')
  }
}
