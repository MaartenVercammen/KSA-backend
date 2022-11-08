import type { Knex } from 'knex';

export async function up(db: Knex) : Promise<void> {
  return db.schema.createTable('magazines', (t) => {
    t.uuid('id').primary();
    t.string('title').notNullable();
    t.string('type').checkIn(['monthly', 'special']).notNullable();
    t.string('path').notNullable();
  });
}

export async function down(db: Knex) : Promise<void> {
  return db.schema.dropTableIfExists('magazines');
}
