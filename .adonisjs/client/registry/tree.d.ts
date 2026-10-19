/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
  tables: {
    index: typeof routes['tables.index']
    store: typeof routes['tables.store']
    update: typeof routes['tables.update']
    destroy: typeof routes['tables.destroy']
  }
  reservations: {
    index: typeof routes['reservations.index']
    store: typeof routes['reservations.store']
    update: typeof routes['reservations.update']
    destroy: typeof routes['reservations.destroy']
  }
  menu: {
    index: typeof routes['menu.index']
    store: typeof routes['menu.store']
    update: typeof routes['menu.update']
    destroy: typeof routes['menu.destroy']
  }
  inventory: {
    index: typeof routes['inventory.index']
    store: typeof routes['inventory.store']
    update: typeof routes['inventory.update']
    move: typeof routes['inventory.move']
    destroy: typeof routes['inventory.destroy']
  }
  orders: {
    index: typeof routes['orders.index']
    store: typeof routes['orders.store']
    update: typeof routes['orders.update']
    status: typeof routes['orders.status']
    items: {
      store: typeof routes['orders.items.store']
      destroy: typeof routes['orders.items.destroy']
    }
  }
}
