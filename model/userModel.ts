import type { User as IUser } from '../types';
import knex from '../database/knexconfig';

const { createHash } = require('crypto');

// TODO use bcrypt
function hash(string: string) {
  return createHash('sha256').update(string).digest('hex');
}

export default class {
  static async create(user: IUser) : Promise<IUser> { return knex('users').insert(user); }

  static async getAll() : Promise<IUser[]> { return knex<IUser>('users').select('*'); }

  static async update(user: IUser) : Promise<number> { return knex<IUser>('users').update(user).where('id', user.id); }

  static async deleteById(id: string) : Promise<number> { return knex('users').delete().where({ id }); }

  static async authenticate(email: string, password: string) : Promise<IUser> {
    return knex
      .select('*')
      .where({ email, password: hash(password) })
      .first();
  }
}
