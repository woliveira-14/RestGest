import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('restaurant_table_id').unsigned().references('id').inTable('restaurant_tables')
      table.string('customer_name', 120).notNullable()
      table.string('customer_phone', 32).notNullable()
      table.string('customer_email', 254).nullable()
      table.integer('party_size').notNullable()
      table.timestamp('reserved_for').notNullable()
      table.string('status', 24).notNullable().defaultTo('confirmed')
      table.text('notes').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
