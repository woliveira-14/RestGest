import type RestaurantTable from '#models/restaurant_table'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class RestaurantTableTransformer extends BaseTransformer<RestaurantTable> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'capacity', 'area', 'status', 'notes']),
      createdAt: this.resource.createdAt.toISO(),
    }
  }
}
