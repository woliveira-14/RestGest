import Order from '#models/order'
import OrderItem from '#models/order_item'
import MenuItem from '#models/menu_item'
import RestaurantTable from '#models/restaurant_table'
import {
  addOrderItemValidator,
  createOrderValidator,
  updateOrderStatusValidator,
  updateOrderValidator,
} from '#validators/order'
import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class OrdersController {
  async index({ inertia }: HttpContext) {
    const [orders, tables, menuItems] = await Promise.all([
      Order.query().preload('restaurantTable').preload('items').orderBy('openedAt', 'desc'),
      RestaurantTable.query().orderBy('name', 'asc'),
      MenuItem.query().where('isAvailable', true).orderBy('category', 'asc').orderBy('name', 'asc'),
    ])

    return inertia.render('orders/index', {
      orders: orders.map((order) => ({
        id: order.id,
        table: order.restaurantTable?.name ?? 'Balcão',
        restaurantTableId: order.restaurantTableId,
        customerName: order.customerName,
        type: order.type,
        status: order.status,
        subtotal: Number(order.subtotal),
        serviceCharge: Number(order.serviceCharge),
        total: Number(order.total),
        notes: order.notes,
        openedAt: order.openedAt.toISO() ?? '',
        items: order.items.map((item) => ({
          id: item.id,
          name: item.itemName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
      })),
      tables: tables.map((table) => ({ id: table.id, name: table.name })),
      menuItems: menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        category: item.category,
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createOrderValidator)
    const trx = await db.transaction()

    try {
      const itemsSubtotal = payload.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      )
      const tableId = payload.restaurantTableId

      /**
       * Lock the table before looking up its active order. This serializes two
       * simultaneous requests for the same table and prevents duplicate open
       * tabs from being created.
       */
      const table = tableId
        ? await RestaurantTable.query({ client: trx })
            .where('id', tableId)
            .forUpdate()
            .firstOrFail()
        : null

      let order = tableId
        ? await Order.query({ client: trx })
            .where('restaurantTableId', tableId)
            .whereNotIn('status', ['paid', 'cancelled'])
            .orderBy('openedAt', 'desc')
            .forUpdate()
            .first()
        : null
      const isExistingTab = order !== null

      if (order) {
        order.useTransaction(trx)
        order.subtotal = Number(order.subtotal) + itemsSubtotal
        order.total = Number(order.subtotal) + Number(order.serviceCharge)
        await order.save()
      } else {
        const serviceCharge = payload.serviceCharge ?? 0
        order = await Order.create(
          {
            restaurantTableId: tableId,
            customerName: payload.customerName,
            type: payload.type ?? 'dine_in',
            status: 'open',
            subtotal: itemsSubtotal,
            serviceCharge,
            total: itemsSubtotal + serviceCharge,
            notes: payload.notes,
            openedAt: DateTime.now(),
          },
          { client: trx }
        )
      }

      await order.related('items').createMany(
        payload.items.map((item) => ({
          menuItemId: item.menuItemId,
          itemName: item.itemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          notes: item.notes,
        }))
      )

      if (table) {
        table.status = 'occupied'
        await table.save()
      }

      await trx.commit()
      session.flash(
        'success',
        isExistingTab
          ? `Itens adicionados à comanda #${order.id}.`
          : `Comanda #${order.id} aberta com sucesso.`
      )
    } catch (error) {
      await trx.rollback()
      throw error
    }

    return response.redirect().toRoute('orders.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    const payload = await request.validateUsing(updateOrderValidator)

    order.merge(payload)
    order.total = Number(order.subtotal) + Number(order.serviceCharge)
    await order.save()

    session.flash('success', `Comanda #${order.id} atualizada.`)
    return response.redirect().toRoute('orders.index')
  }

  async updateStatus({ params, request, response, session }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    const { status } = await request.validateUsing(updateOrderStatusValidator)
    order.status = status
    if (['paid', 'cancelled'].includes(status)) {
      order.closedAt = DateTime.now()
      if (order.restaurantTableId) {
        const table = await RestaurantTable.find(order.restaurantTableId)
        if (table) {
          table.status = 'available'
          await table.save()
        }
      }
    }
    await order.save()
    session.flash('success', 'Status do pedido atualizado.')
    return response.redirect().toRoute('orders.index')
  }

  async addItem({ params, request, response, session }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    const payload = await request.validateUsing(addOrderItemValidator)
    await OrderItem.create({
      orderId: order.id,
      menuItemId: payload.menuItemId,
      itemName: payload.itemName,
      quantity: payload.quantity,
      unitPrice: payload.unitPrice,
      total: payload.quantity * payload.unitPrice,
      notes: payload.notes,
    })

    const increment = payload.quantity * payload.unitPrice
    order.subtotal = Number(order.subtotal) + increment
    order.total = Number(order.subtotal) + Number(order.serviceCharge)
    await order.save()

    session.flash('success', 'Item adicionado ao pedido.')
    return response.redirect().toRoute('orders.index')
  }

  async destroyItem({ params, response, session }: HttpContext) {
    await db.transaction(async (trx) => {
      const item = await OrderItem.query({ client: trx })
        .where('id', params.itemId)
        .where('orderId', params.orderId)
        .forUpdate()
        .firstOrFail()
      const order = await Order.query({ client: trx })
        .where('id', params.orderId)
        .forUpdate()
        .firstOrFail()

      if (['paid', 'cancelled'].includes(order.status)) {
        throw new Exception('Uma comanda paga ou cancelada não pode ser alterada.', {
          status: 409,
          code: 'E_ORDER_CLOSED',
        })
      }

      const subtotal = Math.max(0, Number(order.subtotal) - Number(item.total))
      await item.delete()

      order.subtotal = subtotal
      if (subtotal === 0) {
        order.serviceCharge = 0
        order.total = 0
      } else {
        order.total = subtotal + Number(order.serviceCharge)
      }
      await order.save()
    })

    session.flash('success', 'Item removido da comanda.')
    return response.redirect().toRoute('orders.index')
  }
}
