import vine from '@vinejs/vine'
import { TABLE_STATUSES } from '#models/restaurant_table'

export const createTableValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(80),
  capacity: vine.number().min(1).max(50),
  area: vine.string().trim().minLength(1).maxLength(80),
  status: vine.enum(TABLE_STATUSES).optional(),
  notes: vine.string().trim().maxLength(500).nullable().optional(),
})

export const updateTableValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(80).optional(),
  capacity: vine.number().min(1).max(50).optional(),
  area: vine.string().trim().minLength(1).maxLength(80).optional(),
  status: vine.enum(TABLE_STATUSES).optional(),
  notes: vine.string().trim().maxLength(500).nullable().optional(),
})
