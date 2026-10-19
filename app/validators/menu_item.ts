import vine from '@vinejs/vine'

export const createMenuItemValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  description: vine.string().trim().maxLength(500).nullable().optional(),
  category: vine.string().trim().minLength(2).maxLength(60),
  price: vine.number().positive(),
  isAvailable: vine.boolean().optional(),
})

export const updateMenuItemValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120).optional(),
  description: vine.string().trim().maxLength(500).nullable().optional(),
  category: vine.string().trim().minLength(2).maxLength(60).optional(),
  price: vine.number().positive().optional(),
  isAvailable: vine.boolean().optional(),
})
