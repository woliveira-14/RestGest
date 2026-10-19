/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'tables.index': {
    methods: ["GET","HEAD"],
    pattern: '/tables',
    tokens: [{"old":"/tables","type":0,"val":"tables","end":""}],
    types: placeholder as Registry['tables.index']['types'],
  },
  'tables.store': {
    methods: ["POST"],
    pattern: '/tables',
    tokens: [{"old":"/tables","type":0,"val":"tables","end":""}],
    types: placeholder as Registry['tables.store']['types'],
  },
  'tables.update': {
    methods: ["PUT"],
    pattern: '/tables/:id',
    tokens: [{"old":"/tables/:id","type":0,"val":"tables","end":""},{"old":"/tables/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tables.update']['types'],
  },
  'tables.destroy': {
    methods: ["DELETE"],
    pattern: '/tables/:id',
    tokens: [{"old":"/tables/:id","type":0,"val":"tables","end":""},{"old":"/tables/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['tables.destroy']['types'],
  },
  'reservations.index': {
    methods: ["GET","HEAD"],
    pattern: '/reservations',
    tokens: [{"old":"/reservations","type":0,"val":"reservations","end":""}],
    types: placeholder as Registry['reservations.index']['types'],
  },
  'reservations.store': {
    methods: ["POST"],
    pattern: '/reservations',
    tokens: [{"old":"/reservations","type":0,"val":"reservations","end":""}],
    types: placeholder as Registry['reservations.store']['types'],
  },
  'reservations.update': {
    methods: ["PUT"],
    pattern: '/reservations/:id',
    tokens: [{"old":"/reservations/:id","type":0,"val":"reservations","end":""},{"old":"/reservations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['reservations.update']['types'],
  },
  'reservations.destroy': {
    methods: ["DELETE"],
    pattern: '/reservations/:id',
    tokens: [{"old":"/reservations/:id","type":0,"val":"reservations","end":""},{"old":"/reservations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['reservations.destroy']['types'],
  },
  'menu.index': {
    methods: ["GET","HEAD"],
    pattern: '/menu',
    tokens: [{"old":"/menu","type":0,"val":"menu","end":""}],
    types: placeholder as Registry['menu.index']['types'],
  },
  'menu.store': {
    methods: ["POST"],
    pattern: '/menu',
    tokens: [{"old":"/menu","type":0,"val":"menu","end":""}],
    types: placeholder as Registry['menu.store']['types'],
  },
  'menu.update': {
    methods: ["PUT"],
    pattern: '/menu/:id',
    tokens: [{"old":"/menu/:id","type":0,"val":"menu","end":""},{"old":"/menu/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['menu.update']['types'],
  },
  'menu.destroy': {
    methods: ["DELETE"],
    pattern: '/menu/:id',
    tokens: [{"old":"/menu/:id","type":0,"val":"menu","end":""},{"old":"/menu/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['menu.destroy']['types'],
  },
  'inventory.index': {
    methods: ["GET","HEAD"],
    pattern: '/inventory',
    tokens: [{"old":"/inventory","type":0,"val":"inventory","end":""}],
    types: placeholder as Registry['inventory.index']['types'],
  },
  'inventory.store': {
    methods: ["POST"],
    pattern: '/inventory',
    tokens: [{"old":"/inventory","type":0,"val":"inventory","end":""}],
    types: placeholder as Registry['inventory.store']['types'],
  },
  'inventory.update': {
    methods: ["PUT"],
    pattern: '/inventory/:id',
    tokens: [{"old":"/inventory/:id","type":0,"val":"inventory","end":""},{"old":"/inventory/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['inventory.update']['types'],
  },
  'inventory.move': {
    methods: ["POST"],
    pattern: '/inventory/:id/move',
    tokens: [{"old":"/inventory/:id/move","type":0,"val":"inventory","end":""},{"old":"/inventory/:id/move","type":1,"val":"id","end":""},{"old":"/inventory/:id/move","type":0,"val":"move","end":""}],
    types: placeholder as Registry['inventory.move']['types'],
  },
  'inventory.destroy': {
    methods: ["DELETE"],
    pattern: '/inventory/:id',
    tokens: [{"old":"/inventory/:id","type":0,"val":"inventory","end":""},{"old":"/inventory/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['inventory.destroy']['types'],
  },
  'orders.index': {
    methods: ["GET","HEAD"],
    pattern: '/orders',
    tokens: [{"old":"/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.index']['types'],
  },
  'orders.store': {
    methods: ["POST"],
    pattern: '/orders',
    tokens: [{"old":"/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.store']['types'],
  },
  'orders.update': {
    methods: ["PUT"],
    pattern: '/orders/:id',
    tokens: [{"old":"/orders/:id","type":0,"val":"orders","end":""},{"old":"/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['orders.update']['types'],
  },
  'orders.status': {
    methods: ["PUT"],
    pattern: '/orders/:id/status',
    tokens: [{"old":"/orders/:id/status","type":0,"val":"orders","end":""},{"old":"/orders/:id/status","type":1,"val":"id","end":""},{"old":"/orders/:id/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['orders.status']['types'],
  },
  'orders.items.store': {
    methods: ["POST"],
    pattern: '/orders/:id/items',
    tokens: [{"old":"/orders/:id/items","type":0,"val":"orders","end":""},{"old":"/orders/:id/items","type":1,"val":"id","end":""},{"old":"/orders/:id/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['orders.items.store']['types'],
  },
  'orders.items.destroy': {
    methods: ["DELETE"],
    pattern: '/orders/:orderId/items/:itemId',
    tokens: [{"old":"/orders/:orderId/items/:itemId","type":0,"val":"orders","end":""},{"old":"/orders/:orderId/items/:itemId","type":1,"val":"orderId","end":""},{"old":"/orders/:orderId/items/:itemId","type":0,"val":"items","end":""},{"old":"/orders/:orderId/items/:itemId","type":1,"val":"itemId","end":""}],
    types: placeholder as Registry['orders.items.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
