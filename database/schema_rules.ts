import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

/**
 * Rules applied when AdonisJS regenerates "database/schema.ts" from the live
 * database structure (triggered by `node ace migration:run`).
 *
 * By default Lucid maps SQL Server `decimal` columns to `string` while SQLite
 * maps them to `number`. Forcing `number` on both keeps the generated schema
 * — and therefore the Inertia props shared with React — identical no matter
 * which connection the developer is running against.
 */
export default {
  types: {
    decimal: {
      tsType: 'number',
      imports: [],
      decorators: [{ name: '@column' }],
    },
  },
} satisfies SchemaRules
