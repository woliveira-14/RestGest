import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('restaurant_tables', (table) => {
      table.increments('id').notNullable()
      table.string('name', 80).notNullable().unique()
      table.integer('capacity').notNullable()
      table.string('area', 80).notNullable().defaultTo('Salão principal')
      table.string('status', 24).notNullable().defaultTo('available')
      table.text('notes').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('restaurant_tables')
  }
}
