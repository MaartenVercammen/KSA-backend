import { v4 as uuid } from 'uuid';
import type { Post as IPost } from '../types';
import knex from '../database/knexconfig';
import newLogger from '../modules/logger';

const logger = newLogger('model.Post');

export default class {
  static async create(post: IPost): Promise<IPost> {
    logger.silly('[create] Hello!');
    return knex('posts').insert({
      ...post,
      id: uuid(),
    });
  }

  static async getAll(): Promise<IPost[]> {
    logger.silly('[getAll] Hello!');
    return knex<IPost>('posts').select('*');
  }

  static async update(post: IPost): Promise<number> {
    logger.silly('[update] Hello!');
    return knex('posts').update(post).where('id', post.id);
  }

  static async deleteById(id: string): Promise<number> {
    logger.silly('[update] Hello!');
    return knex('posts').delete().where({ id });
  }
}
