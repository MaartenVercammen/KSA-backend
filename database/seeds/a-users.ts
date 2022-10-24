/* eslint-disable no-console */
import type { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('\x1b[33mApplication is not running in development mode, skipping seed...\x1b[0m');
    return Promise.resolve();
  }
  const result = await knex('users').select();
  if (result.length !== 0) {
    console.warn('\x1b[33mTable ´users´ already contains data, skipping seed...\x1b[0m');
    return Promise.resolve();
  }

  const password = bcrypt.hashSync('test', Number(process.env.BCRYPT_SALT_ROUNDS));

  return knex('users').insert([
    {
      id: uuid(),
      first_name: 'Admin',
      last_name: 'Dev',
      email: 'admin@ksa.dev',
      role: 'ADMIN',
      password,
    },
    {
      id: uuid(),
      first_name: 'Bonds',
      last_name: 'Dev',
      email: 'bonds@ksa.dev',
      role: 'BONDS',
      password,
    },
    {
      id: uuid(),
      first_name: 'Braggel',
      last_name: 'Dev',
      email: 'braggel@ksa.dev',
      role: 'BRAGGEL',
      password,
    },
  ]);
}

export default seed;
