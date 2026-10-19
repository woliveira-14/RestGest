import { OrderSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import RestaurantTable from '#models/restaurant_table'
import OrderItem from '#models/order_item'

export const ORDER_STATUSES = ['open', 'preparing', 'ready', 'served', 'paid', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export default class Order extends OrderSchema {
  @belongsTo(() => RestaurantTable)
  declare restaurantTable: BelongsTo<typeof RestaurantTable>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>
}
