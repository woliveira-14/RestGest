import RestaurantTable from '#models/restaurant_table'
import { createTableValidator, updateTableValidator } from '#validators/restaurant_table'
import type { HttpContext } from '@adonisjs/core/http'

export default class RestaurantTablesController {
  async index({ inertia }: HttpContext) {
    const tables = await RestaurantTable.query().orderBy('name', 'asc')

    return inertia.render('tables/index', {
      tables: tables.map((table) => ({
        id: table.id,
        name: table.name,
        capacity: table.capacity,
        area: table.area,
        status: table.status,
        notes: table.notes,
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createTableValidator)
    await RestaurantTable.create(payload)

    session.flash('success', 'Mesa cadastrada com sucesso.')
    return response.redirect().toRoute('tables.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const table = await RestaurantTable.findOrFail(params.id)
    const payload = await request.validateUsing(updateTableValidator)

    table.merge(payload)
    await table.save()

    session.flash('success', 'Mesa atualizada.')
    return response.redirect().toRoute('tables.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const table = await RestaurantTable.findOrFail(params.id)
    await table.delete()

    session.flash('success', 'Mesa removida.')
    return response.redirect().toRoute('tables.index')
  }
}
