/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.get('dashboard', [controllers.Dashboard, 'index']).as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])

    /**
     * Mesas do salão
     */
    router.get('tables', [controllers.RestaurantTables, 'index']).as('tables.index')
    router.post('tables', [controllers.RestaurantTables, 'store']).as('tables.store')
    router.put('tables/:id', [controllers.RestaurantTables, 'update']).as('tables.update')
    router.delete('tables/:id', [controllers.RestaurantTables, 'destroy']).as('tables.destroy')

    /**
     * Reservas
     */
    router.get('reservations', [controllers.Reservations, 'index']).as('reservations.index')
    router.post('reservations', [controllers.Reservations, 'store']).as('reservations.store')
    router.put('reservations/:id', [controllers.Reservations, 'update']).as('reservations.update')
    router
      .delete('reservations/:id', [controllers.Reservations, 'destroy'])
      .as('reservations.destroy')

    /**
     * Cardápio
     */
    router.get('menu', [controllers.MenuItems, 'index']).as('menu.index')
    router.post('menu', [controllers.MenuItems, 'store']).as('menu.store')
    router.put('menu/:id', [controllers.MenuItems, 'update']).as('menu.update')
    router.delete('menu/:id', [controllers.MenuItems, 'destroy']).as('menu.destroy')

    /**
     * Estoque
     */
    router.get('inventory', [controllers.InventoryItems, 'index']).as('inventory.index')
    router.post('inventory', [controllers.InventoryItems, 'store']).as('inventory.store')
    router.put('inventory/:id', [controllers.InventoryItems, 'update']).as('inventory.update')
    router.post('inventory/:id/move', [controllers.InventoryItems, 'move']).as('inventory.move')
    router.delete('inventory/:id', [controllers.InventoryItems, 'destroy']).as('inventory.destroy')

    /**
     * Pedidos
     */
    router.get('orders', [controllers.Orders, 'index']).as('orders.index')
    router.post('orders', [controllers.Orders, 'store']).as('orders.store')
    router.put('orders/:id', [controllers.Orders, 'update']).as('orders.update')
    router.put('orders/:id/status', [controllers.Orders, 'updateStatus']).as('orders.status')
    router.post('orders/:id/items', [controllers.Orders, 'addItem']).as('orders.items.store')
    router
      .delete('orders/:orderId/items/:itemId', [controllers.Orders, 'destroyItem'])
      .as('orders.items.destroy')
  })
  .use(middleware.auth())
