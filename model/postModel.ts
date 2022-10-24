import { v4 as uuid } from 'uuid';
import type { Post as IPost } from '../types';
import knex from '../database/knexconfig';

export default class {
  static async create(post: IPost): Promise<IPost> {
    return knex('posts').insert({
      ...post,
      id: uuid(),
    });
  }

  static async getAll(): Promise<IPost[]> { return knex<IPost>('posts').select('*'); }

  static async update(post: IPost): Promise<number> { return knex('posts').update(post).where('id', post.id); }

  static async deleteById(id: string): Promise<number> { return knex('posts').delete().where({ id }); }
}
