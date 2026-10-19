import vine from '@vinejs/vine'
import { RESERVATION_STATUSES } from '#models/reservation'

export const createReservationValidator = vine.create({
  restaurantTableId: vine.number().positive().optional(),
  customerName: vine.string().trim().minLength(2).maxLength(120),
  customerPhone: vine.string().trim().minLength(8).maxLength(32),
  customerEmail: vine.string().trim().email().maxLength(254).nullable().optional(),
  partySize: vine.number().min(1).max(50),
  reservedFor: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }),
  status: vine.enum(RESERVATION_STATUSES).optional(),
  notes: vine.string().trim().maxLength(1000).nullable().optional(),
})

export const updateReservationValidator = vine.create({
  restaurantTableId: vine.number().positive().nullable().optional(),
  customerName: vine.string().trim().minLength(2).maxLength(120).optional(),
  customerPhone: vine.string().trim().minLength(8).maxLength(32).optional(),
  customerEmail: vine.string().trim().email().maxLength(254).nullable().optional(),
  partySize: vine.number().min(1).max(50).optional(),
  reservedFor: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }).optional(),
  status: vine.enum(RESERVATION_STATUSES).optional(),
  notes: vine.string().trim().maxLength(1000).nullable().optional(),
})
