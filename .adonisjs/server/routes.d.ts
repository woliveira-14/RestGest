import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'tables.index': { paramsTuple?: []; params?: {} }
    'tables.store': { paramsTuple?: []; params?: {} }
    'tables.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tables.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reservations.index': { paramsTuple?: []; params?: {} }
    'reservations.store': { paramsTuple?: []; params?: {} }
    'reservations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reservations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menu.index': { paramsTuple?: []; params?: {} }
    'menu.store': { paramsTuple?: []; params?: {} }
    'menu.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menu.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inventory.index': { paramsTuple?: []; params?: {} }
    'inventory.store': { paramsTuple?: []; params?: {} }
    'inventory.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inventory.move': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inventory.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index': { paramsTuple?: []; params?: {} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'orders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.items.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.items.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'orderId': ParamValue,'itemId': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'tables.index': { paramsTuple?: []; params?: {} }
    'reservations.index': { paramsTuple?: []; params?: {} }
    'menu.index': { paramsTuple?: []; params?: {} }
    'inventory.index': { paramsTuple?: []; params?: {} }
    'orders.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'tables.index': { paramsTuple?: []; params?: {} }
    'reservations.index': { paramsTuple?: []; params?: {} }
    'menu.index': { paramsTuple?: []; params?: {} }
    'inventory.index': { paramsTuple?: []; params?: {} }
    'orders.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'tables.store': { paramsTuple?: []; params?: {} }
    'reservations.store': { paramsTuple?: []; params?: {} }
    'menu.store': { paramsTuple?: []; params?: {} }
    'inventory.store': { paramsTuple?: []; params?: {} }
    'inventory.move': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'orders.items.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'tables.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reservations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menu.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inventory.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'tables.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reservations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menu.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'inventory.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.items.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'orderId': ParamValue,'itemId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}