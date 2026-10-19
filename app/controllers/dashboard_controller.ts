import Order from '#models/order'
import Reservation from '#models/reservation'
import RestaurantTable from '#models/restaurant_table'
import InventoryItem from '#models/inventory_item'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const [orders, reservations, tables, inventory] = await Promise.all([
      Order.query().preload('restaurantTable').orderBy('openedAt', 'desc').limit(8),
      Reservation.query().preload('restaurantTable').orderBy('reservedFor', 'asc').limit(8),
      RestaurantTable.all(),
      InventoryItem.query().orderBy('currentQuantity', 'asc'),
    ])

    const today = DateTime.local().startOf('day')
    const todaysReservations = reservations.filter((item) => item.reservedFor >= today)
    const activeOrders = orders.filter((order) => !['paid', 'cancelled'].includes(order.status))
    const lowStock = inventory.filter((item) => item.isLowStock)

    return inertia.render('dashboard', {
      metrics: {
        revenue: orders
          .filter((order) => order.status === 'paid')
          .reduce((sum, order) => sum + Number(order.total), 0),
        activeOrders: activeOrders.length,
        todaysReservations: todaysReservations.length,
        occupiedTables: tables.filter((table) => table.status === 'occupied').length,
        totalTables: tables.length,
        lowStockItems: lowStock.length,
      },
      recentOrders: activeOrders.slice(0, 5).map((order) => ({
        id: order.id,
        table: order.restaurantTable?.name ?? 'Balcão',
        customerName: order.customerName,
        status: order.status,
        total: Number(order.total),
        openedAt: order.openedAt.toISO() ?? '',
      })),
      upcomingReservations: todaysReservations.slice(0, 5).map((reservation) => ({
        id: reservation.id,
        customerName: reservation.customerName,
        partySize: reservation.partySize,
        table: reservation.restaurantTable?.name ?? 'A definir',
        status: reservation.status,
        reservedFor: reservation.reservedFor.toISO() ?? '',
      })),
      lowStock: lowStock.slice(0, 5).map((item) => ({
        id: item.id,
        name: item.name,
        currentQuantity: Number(item.currentQuantity),
        minimumQuantity: Number(item.minimumQuantity),
        unit: item.unit,
      })),
    })
  }
}
