/* eslint-disable no-console */
import type { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('\x1b[33mApplication is not running in development mode, skipping seed...\x1b[0m');
    return Promise.resolve();
  }
  const result = await knex('magazines').select();
  if (result.length !== 0) {
    console.warn('\x1b[33mTable ´posts´ already contains data, skipping seed...\x1b[0m');
    return Promise.resolve();
  }

  return knex('magazines').insert([
    {
      id: uuid(),
      title: 'fake-monthly-magazine.pdf',
      type: 'monthly',
      path: '/uploads/fakes/fake-monthly-magazine.pdf',
    },
    {
      id: uuid(),
      title: 'fake-special-magazine.pdf',
      type: 'special',
      path: '/uploads/fakes/fake-special-magazine.pdf',
    },
  ]);
}

export default seed;
