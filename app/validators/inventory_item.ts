import vine from '@vinejs/vine'

export const createInventoryItemValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  unit: vine.string().trim().minLength(1).maxLength(24),
  currentQuantity: vine.number().min(0),
  minimumQuantity: vine.number().min(0),
  unitCost: vine.number().min(0),
  supplier: vine.string().trim().maxLength(120).nullable().optional(),
  expiresAt: vine
    .date({ formats: ['YYYY-MM-DD'] })
    .nullable()
    .optional(),
})

export const updateInventoryItemValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120).optional(),
  unit: vine.string().trim().minLength(1).maxLength(24).optional(),
  currentQuantity: vine.number().min(0).optional(),
  minimumQuantity: vine.number().min(0).optional(),
  unitCost: vine.number().min(0).optional(),
  supplier: vine.string().trim().maxLength(120).nullable().optional(),
  expiresAt: vine
    .date({ formats: ['YYYY-MM-DD'] })
    .nullable()
    .optional(),
})

/**
 * Quick stock movement: add or remove a quantity from the current stock.
 */
export const stockMovementValidator = vine.create({
  quantity: vine.number().positive(),
  operation: vine.enum(['increase', 'decrease'] as const),
})
