import { v4 as uuid } from 'uuid';
import type { Magazine as IMagazine } from '../types';
import knex from '../database/knexconfig';
import newLogger from '../modules/logger';

const logger = newLogger('model.Magazine');

export default class {
  static async create(magazine: IMagazine) : Promise<IMagazine> {
    logger.silly('[create] Hello!');
    return knex('magazine').insert({
      ...magazine,
      id: uuid(),
    });
  }

  static async getAll() : Promise<IMagazine[]> {
    logger.silly('[getAll] Hello!');
    return knex<IMagazine>('magazines')
      .select('*');
  }

  static async deleteById(id: string) : Promise<IMagazine[]> {
    logger.silly('[delete] Hello!');
    return knex('magazines').delete().where({ id }).returning('path');
  }
}
