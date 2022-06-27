const { Pool } = require("pg");
import * as dotenv from "dotenv";
dotenv.config();

const connectionPool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_SCHEMA,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_IP,
});

export { connectionPool };
