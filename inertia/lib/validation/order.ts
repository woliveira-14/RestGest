import { z } from 'zod'

/**
 * Client-side mirror of `#validators/order` (createOrderValidator), used to
 * give instant feedback before the request reaches AdonisJS/VineJS, which
 * remains the source of truth on the server.
 */
export const orderItemSchema = z.object({
  menuItemId: z.number().int().positive().optional(),
  itemName: z.string().trim().min(1, 'Informe o nome do item').max(120),
  quantity: z.number().int().min(1).max(100),
  unitPrice: z.number().positive('Informe um preço válido'),
  notes: z.string().trim().max(300).optional(),
})

export const createOrderSchema = z.object({
  restaurantTableId: z.number().int().positive().optional(),
  customerName: z.string().trim().max(120).optional(),
  type: z.enum(['dine_in', 'takeaway', 'delivery']).default('dine_in'),
  serviceCharge: z.number().min(0).default(0),
  notes: z.string().trim().max(500).optional(),
  items: z.array(orderItemSchema).min(1, 'Adicione ao menos um item ao pedido'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
