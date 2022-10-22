import knex from 'knex';
import config from './knexfile';

const stringCaseKnex = require('knex-stringcase');

const options = stringCaseKnex(config[process.env.NODE_ENV]);
export default knex(options);
