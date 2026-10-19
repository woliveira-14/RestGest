import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 120).notNullable().unique()
      table.string('unit', 24).notNullable()
      table.decimal('current_quantity', 12, 3).notNullable().defaultTo(0)
      table.decimal('minimum_quantity', 12, 3).notNullable().defaultTo(0)
      table.decimal('unit_cost', 12, 2).notNullable().defaultTo(0)
      table.string('supplier', 120).nullable()
      table.timestamp('expires_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
