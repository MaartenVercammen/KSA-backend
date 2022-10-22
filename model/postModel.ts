import type { Post as IPost } from '../types';
import knex from '../database/knexconfig';

export default class {
  static async create(user: IPost): Promise<IPost> { return knex('posts').insert(user); }

  static async getAll(): Promise<IPost[]> { return knex<IPost>('posts').select('*'); }

  static async update(user: IPost): Promise<number> { return knex('posts').update(user).where('id', user.id); }

  static async deleteById(id: string): Promise<number> { return knex('posts').delete().where({ id }); }
}
