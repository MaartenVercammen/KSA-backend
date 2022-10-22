import * as dotenv from 'dotenv';
import path from 'path';

const { Pool } = require('pg');

dotenv.config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`) });

setTimeout((_) => _, 5000);

const connectionPool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_IP,
});

export default connectionPool;
