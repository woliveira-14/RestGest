import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('orders', (table) => {
      table.increments('id').notNullable()
      table.integer('restaurant_table_id').unsigned().references('id').inTable('restaurant_tables')
      table.string('customer_name', 120).nullable()
      table.string('type', 24).notNullable().defaultTo('dine_in')
      table.string('status', 24).notNullable().defaultTo('open')
      table.decimal('subtotal', 12, 2).notNullable().defaultTo(0)
      table.decimal('service_charge', 12, 2).notNullable().defaultTo(0)
      table.decimal('total', 12, 2).notNullable().defaultTo(0)
      table.text('notes').nullable()
      table.timestamp('opened_at').notNullable()
      table.timestamp('closed_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('order_items', (table) => {
      table.increments('id').notNullable()
      table
        .integer('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
      table.integer('menu_item_id').unsigned().references('id').inTable('menu_items')
      table.string('item_name', 120).notNullable()
      table.integer('quantity').notNullable().defaultTo(1)
      table.decimal('unit_price', 10, 2).notNullable()
      table.decimal('total', 12, 2).notNullable()
      table.text('notes').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('order_items')
    this.schema.dropTable('orders')
  }
}
