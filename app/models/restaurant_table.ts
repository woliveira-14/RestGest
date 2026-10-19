import { RestaurantTableSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Reservation from '#models/reservation'
import Order from '#models/order'

export const TABLE_STATUSES = ['available', 'occupied', 'reserved', 'maintenance'] as const
export type TableStatus = (typeof TABLE_STATUSES)[number]

export default class RestaurantTable extends RestaurantTableSchema {
  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>

  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>
}
