import vine from '@vinejs/vine'
import { ORDER_STATUSES } from '#models/order'

const orderItemSchema = vine.object({
  menuItemId: vine.number().positive().optional(),
  itemName: vine.string().trim().minLength(1).maxLength(120),
  quantity: vine.number().min(1).max(100),
  unitPrice: vine.number().positive(),
  notes: vine.string().trim().maxLength(300).nullable().optional(),
})

export const createOrderValidator = vine.create({
  restaurantTableId: vine.number().positive().optional(),
  customerName: vine.string().trim().maxLength(120).nullable().optional(),
  type: vine.enum(['dine_in', 'takeaway', 'delivery'] as const).optional(),
  serviceCharge: vine.number().min(0).optional(),
  notes: vine.string().trim().maxLength(500).nullable().optional(),
  items: vine.array(orderItemSchema).minLength(1),
})

export const updateOrderStatusValidator = vine.create({
  status: vine.enum(ORDER_STATUSES),
})

export const updateOrderValidator = vine.create({
  customerName: vine.string().trim().maxLength(120).nullable().optional(),
  type: vine.enum(['dine_in', 'takeaway', 'delivery'] as const).optional(),
  serviceCharge: vine.number().min(0).optional(),
  notes: vine.string().trim().maxLength(500).nullable().optional(),
})

export const addOrderItemValidator = vine.create(orderItemSchema)
