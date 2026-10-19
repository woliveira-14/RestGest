/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'tables.index': {
    methods: ["GET","HEAD"]
    pattern: '/tables'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['index']>>>
    }
  }
  'tables.store': {
    methods: ["POST"]
    pattern: '/tables'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/restaurant_table').createTableValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/restaurant_table').createTableValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tables.update': {
    methods: ["PUT"]
    pattern: '/tables/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/restaurant_table').updateTableValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/restaurant_table').updateTableValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tables.destroy': {
    methods: ["DELETE"]
    pattern: '/tables/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/restaurant_tables_controller').default['destroy']>>>
    }
  }
  'reservations.index': {
    methods: ["GET","HEAD"]
    pattern: '/reservations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['index']>>>
    }
  }
  'reservations.store': {
    methods: ["POST"]
    pattern: '/reservations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reservation').createReservationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/reservation').createReservationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'reservations.update': {
    methods: ["PUT"]
    pattern: '/reservations/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/reservation').updateReservationValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/reservation').updateReservationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'reservations.destroy': {
    methods: ["DELETE"]
    pattern: '/reservations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reservations_controller').default['destroy']>>>
    }
  }
  'menu.index': {
    methods: ["GET","HEAD"]
    pattern: '/menu'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['index']>>>
    }
  }
  'menu.store': {
    methods: ["POST"]
    pattern: '/menu'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/menu_item').createMenuItemValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/menu_item').createMenuItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'menu.update': {
    methods: ["PUT"]
    pattern: '/menu/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/menu_item').updateMenuItemValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/menu_item').updateMenuItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'menu.destroy': {
    methods: ["DELETE"]
    pattern: '/menu/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menu_items_controller').default['destroy']>>>
    }
  }
  'inventory.index': {
    methods: ["GET","HEAD"]
    pattern: '/inventory'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['index']>>>
    }
  }
  'inventory.store': {
    methods: ["POST"]
    pattern: '/inventory'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inventory_item').createInventoryItemValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/inventory_item').createInventoryItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inventory.update': {
    methods: ["PUT"]
    pattern: '/inventory/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inventory_item').updateInventoryItemValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/inventory_item').updateInventoryItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inventory.move': {
    methods: ["POST"]
    pattern: '/inventory/:id/move'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/inventory_item').stockMovementValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/inventory_item').stockMovementValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['move']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['move']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'inventory.destroy': {
    methods: ["DELETE"]
    pattern: '/inventory/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/inventory_items_controller').default['destroy']>>>
    }
  }
  'orders.index': {
    methods: ["GET","HEAD"]
    pattern: '/orders'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['index']>>>
    }
  }
  'orders.store': {
    methods: ["POST"]
    pattern: '/orders'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/order').createOrderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/order').createOrderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'orders.update': {
    methods: ["PUT"]
    pattern: '/orders/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/order').updateOrderValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/order').updateOrderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'orders.status': {
    methods: ["PUT"]
    pattern: '/orders/:id/status'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/order').updateOrderStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/order').updateOrderStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['updateStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['updateStatus']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'orders.items.store': {
    methods: ["POST"]
    pattern: '/orders/:id/items'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/order').addOrderItemValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/order').addOrderItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['addItem']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['addItem']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'orders.items.destroy': {
    methods: ["DELETE"]
    pattern: '/orders/:orderId/items/:itemId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { orderId: ParamValue; itemId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['destroyItem']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/orders_controller').default['destroyItem']>>>
    }
  }
}
