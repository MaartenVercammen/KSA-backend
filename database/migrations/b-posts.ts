import type { Knex } from 'knex';

export async function up(db: Knex) : Promise<void> {
  return db.schema.createTable('posts', (t) => {
    t.uuid('id').primary();
    t.string('title').notNullable();
    t.text('content').notNullable();
    t.date('date').notNullable().defaultTo(new Date().toISOString());
  });
}

export async function down(db: Knex) : Promise<void> {
  return db.schema.dropTableIfExists('posts');
}
