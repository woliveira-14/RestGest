import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import RestaurantTable from '#models/restaurant_table'
import Reservation from '#models/reservation'
import MenuItem from '#models/menu_item'
import Order from '#models/order'

test.group('Restaurant operations', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('authenticated manager can create a restaurant table', async ({ client, assert }) => {
    const manager = await User.create({
      fullName: 'Gerente de Teste',
      email: 'manager.tables@test.local',
      password: 'password123',
    })

    const response = await client
      .post('/tables')
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)
      .json({
        name: 'Mesa Teste 01',
        capacity: 4,
        area: 'Salão',
        status: 'available',
      })

    response.assertStatus(302)
    response.assertHeader('location', '/tables')

    const table = await RestaurantTable.findBy('name', 'Mesa Teste 01')
    assert.isNotNull(table)
    assert.equal(table!.capacity, 4)
  })

  test('authenticated manager can create a reservation from datetime-local input', async ({
    client,
    assert,
  }) => {
    const manager = await User.create({
      fullName: 'Gerente de Reservas',
      email: 'manager.reservations@test.local',
      password: 'password123',
    })
    const table = await RestaurantTable.create({
      name: 'Mesa Reserva',
      capacity: 6,
      area: 'Varanda',
      status: 'available',
    })

    const response = await client
      .post('/reservations')
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)
      .json({
        restaurantTableId: table.id,
        customerName: 'Cliente Reserva',
        customerPhone: '11999990000',
        partySize: 3,
        reservedFor: '2026-12-24T20:30',
      })

    response.assertStatus(302)
    response.assertHeader('location', '/reservations')

    const reservation = await Reservation.findBy('customerName', 'Cliente Reserva')
    assert.isNotNull(reservation)
    assert.equal(reservation!.restaurantTableId, table.id)

    const updateResponse = await client
      .put(`/reservations/${reservation!.id}`)
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)
      .json({
        customerName: 'Cliente Reserva Atualizado',
        customerPhone: '11999991111',
        partySize: 4,
        reservedFor: '2026-12-24T21:00',
        status: 'pending',
        notes: 'Preferência por mesa na varanda',
      })

    updateResponse.assertStatus(303)
    updateResponse.assertHeader('location', '/reservations')

    await reservation!.refresh()
    assert.equal(reservation!.customerName, 'Cliente Reserva Atualizado')
    assert.equal(reservation!.partySize, 4)
    assert.equal(reservation!.status, 'pending')
    assert.equal(reservation!.notes, 'Preferência por mesa na varanda')
  })

  test('authenticated manager can update a menu item', async ({ client, assert }) => {
    const manager = await User.create({
      fullName: 'Gerente de Cardápio',
      email: 'manager.menu@test.local',
      password: 'password123',
    })
    const item = await MenuItem.create({
      name: 'Prato original',
      description: 'Receita original',
      category: 'Pratos principais',
      price: 30,
      isAvailable: true,
    })

    const response = await client
      .put(`/menu/${item.id}`)
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)
      .json({
        name: 'Prato atualizado',
        description: 'Nova descrição da receita',
        category: 'Especiais',
        price: 42.5,
        isAvailable: false,
      })

    response.assertStatus(303)
    response.assertHeader('location', '/menu')

    await item.refresh()
    assert.equal(item.name, 'Prato atualizado')
    assert.equal(item.description, 'Nova descrição da receita')
    assert.equal(item.category, 'Especiais')
    assert.equal(Number(item.price), 42.5)
    assert.equal(Number(item.isAvailable), 0)
  })

  test('opening an order occupies its table and persists line items', async ({
    client,
    assert,
  }) => {
    const manager = await User.create({
      fullName: 'Gerente de Pedidos',
      email: 'manager.orders@test.local',
      password: 'password123',
    })
    const table = await RestaurantTable.create({
      name: 'Mesa Pedido',
      capacity: 2,
      area: 'Salão',
      status: 'available',
    })
    const menuItem = await MenuItem.create({
      name: 'Prato de teste',
      category: 'Teste',
      price: 25.5,
      isAvailable: true,
    })

    const response = await client
      .post('/orders')
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)
      .json({
        restaurantTableId: table.id,
        type: 'dine_in',
        serviceCharge: 2.5,
        items: [
          {
            menuItemId: menuItem.id,
            itemName: menuItem.name,
            quantity: 2,
            unitPrice: 25.5,
          },
        ],
      })

    response.assertStatus(302)
    response.assertHeader('location', '/orders')

    const order = await Order.query()
      .where('restaurantTableId', table.id)
      .preload('items')
      .firstOrFail()
    await table.refresh()

    assert.equal(Number(order.subtotal), 51)
    assert.equal(Number(order.total), 53.5)
    assert.equal(order.items.length, 1)
    assert.equal(order.items[0].quantity, 2)
    assert.equal(table.status, 'occupied')

    const additionalItemsResponse = await client
      .post('/orders')
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)
      .json({
        restaurantTableId: table.id,
        type: 'dine_in',
        items: [
          {
            menuItemId: menuItem.id,
            itemName: menuItem.name,
            quantity: 1,
            unitPrice: 25.5,
          },
        ],
      })

    additionalItemsResponse.assertStatus(302)
    additionalItemsResponse.assertHeader('location', '/orders')

    const openOrders = await Order.query()
      .where('restaurantTableId', table.id)
      .whereNotIn('status', ['paid', 'cancelled'])
      .preload('items')
    const updatedOrder = openOrders[0]

    assert.equal(openOrders.length, 1)
    assert.equal(updatedOrder.id, order.id)
    assert.equal(Number(updatedOrder.subtotal), 76.5)
    assert.equal(Number(updatedOrder.total), 79)
    assert.equal(updatedOrder.items.length, 2)

    const wrongItem = updatedOrder.items[1]
    const removeItemResponse = await client
      .delete(`/orders/${updatedOrder.id}/items/${wrongItem.id}`)
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)

    removeItemResponse.assertStatus(303)
    removeItemResponse.assertHeader('location', '/orders')

    await updatedOrder.refresh()
    await updatedOrder.load('items')
    assert.equal(Number(updatedOrder.subtotal), 51)
    assert.equal(Number(updatedOrder.total), 53.5)
    assert.equal(updatedOrder.items.length, 1)

    const updateOrderResponse = await client
      .put(`/orders/${updatedOrder.id}`)
      .loginAs(manager)
      .withCsrfToken()
      .withInertia()
      .redirects(0)
      .json({
        customerName: 'Cliente da comanda',
        type: 'takeaway',
        serviceCharge: 5,
        notes: 'Retirar às 20h',
      })

    updateOrderResponse.assertStatus(303)
    updateOrderResponse.assertHeader('location', '/orders')

    await updatedOrder.refresh()
    assert.equal(updatedOrder.customerName, 'Cliente da comanda')
    assert.equal(updatedOrder.type, 'takeaway')
    assert.equal(Number(updatedOrder.serviceCharge), 5)
    assert.equal(Number(updatedOrder.total), 56)
    assert.equal(updatedOrder.notes, 'Retirar às 20h')
  })
})
