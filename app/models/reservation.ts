import { ReservationSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import RestaurantTable from '#models/restaurant_table'

export const RESERVATION_STATUSES = [
  'confirmed',
  'pending',
  'seated',
  'cancelled',
  'no_show',
] as const
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number]

export default class Reservation extends ReservationSchema {
  @belongsTo(() => RestaurantTable)
  declare restaurantTable: BelongsTo<typeof RestaurantTable>
}
