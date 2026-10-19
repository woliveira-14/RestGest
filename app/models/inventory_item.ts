import { InventoryItemSchema } from '#database/schema'

export default class InventoryItem extends InventoryItemSchema {
  get isLowStock() {
    return this.currentQuantity <= this.minimumQuantity
  }
}
