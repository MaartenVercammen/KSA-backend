import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

// TODO rework app startup
dotenv.config({ path: path.resolve('.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env['DB_DRIVER'] || '',
    connection: {
      host: process.env['DB_HOST'] || '',
      user: process.env['DB_USER'] || '',
      password: process.env['DB_PASSWORD'] || '',
      database: process.env['DB_NAME'] || '',
      port: parseInt(<string>process.env?.['DB_PORT'], 10),
    },
  },
  production: {
    client: process.env['DB_DRIVER'] || '',
    connection: {
      host: process.env['DB_HOST'] || '',
      user: process.env['DB_USER'] || '',
      password: process.env['DB_PASSWORD'] || '',
      database: process.env['DB_NAME'] || '',
      port: parseInt(<string>process.env?.['DB_PORT'], 10),
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;
