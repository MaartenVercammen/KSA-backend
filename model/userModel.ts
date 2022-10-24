import bcrypt from 'bcrypt';
import type { User as IUser } from '../types';
import knex from '../database/knexconfig';

export default class {
  static async create(user: IUser) : Promise<IUser> {
    return knex('users').insert({
      ...user,
      password: bcrypt.hashSync(user.password, process.env.BCRYPT_SALT_ROUNDS),
    });
  }

  static async getAll() : Promise<IUser[]> { return knex<IUser>('users').select('*'); }

  static async update(user: IUser) : Promise<number> { return knex<IUser>('users').update(user).where('id', user.id); }

  static async deleteById(id: string) : Promise<number> { return knex('users').delete().where({ id }); }

  static async authenticateAndGet(email: string, password: string) : Promise<IUser> {
    const foundUser = await knex
      .select('*')
      .where({ email })
      .first();

    return bcrypt.compareSync(password, foundUser.password) ? foundUser : undefined;
  }
}
