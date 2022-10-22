import type { Knex } from 'knex';

export async function up(db: Knex) : Promise<void> {
  return db.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('password').notNullable();
    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.string('email').notNullable();
    t.string('role').checkIn(['BRAGGEL', 'BONDS', 'ADMIN']).notNullable();
  });
}

export async function down(db: Knex) : Promise<void> {
  return db.schema.dropTableIfExists('users');
}
