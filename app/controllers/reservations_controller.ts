import Reservation from '#models/reservation'
import RestaurantTable from '#models/restaurant_table'
import { createReservationValidator, updateReservationValidator } from '#validators/reservation'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReservationsController {
  async index({ inertia }: HttpContext) {
    const [reservations, tables] = await Promise.all([
      Reservation.query().preload('restaurantTable').orderBy('reservedFor', 'asc'),
      RestaurantTable.query().orderBy('name', 'asc'),
    ])

    return inertia.render('reservations/index', {
      reservations: reservations.map((reservation) => ({
        id: reservation.id,
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail,
        partySize: reservation.partySize,
        reservedFor: reservation.reservedFor.toFormat("yyyy-MM-dd'T'HH:mm"),
        status: reservation.status,
        notes: reservation.notes,
        restaurantTableId: reservation.restaurantTableId,
        tableName: reservation.restaurantTable?.name ?? 'A definir',
      })),
      tables: tables.map((table) => ({ id: table.id, name: table.name, capacity: table.capacity })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createReservationValidator)
    await Reservation.create(payload)
    session.flash('success', 'Reserva criada com sucesso.')
    return response.redirect().toRoute('reservations.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const reservation = await Reservation.findOrFail(params.id)
    reservation.merge(await request.validateUsing(updateReservationValidator))
    await reservation.save()
    session.flash('success', 'Reserva atualizada.')
    return response.redirect().toRoute('reservations.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const reservation = await Reservation.findOrFail(params.id)
    await reservation.delete()
    session.flash('success', 'Reserva removida.')
    return response.redirect().toRoute('reservations.index')
  }
}
