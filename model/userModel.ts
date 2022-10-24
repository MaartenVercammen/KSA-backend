import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import type { User as IUser } from '../types';
import knex from '../database/knexconfig';
import newLogger from '../modules/logger';

const logger = newLogger('model.User');

export default class {
  static async create(user: IUser) : Promise<IUser> {
    logger.silly('[create] Hello!');
    return knex('users').insert({
      ...user,
      id: uuid(),
      password: bcrypt.hashSync(user.password, Number(process.env.BCRYPT_SALT_ROUNDS)),
    });
  }

  static async getAll() : Promise<IUser[]> {
    logger.silly('[getAll] Hello!');
    return knex<IUser>('users')
      .select('id', 'firstName', 'lastName', 'email', 'role');
  }

  static async update(user: IUser) : Promise<number> {
    logger.silly('[update] Hello!');
    const toUpdate = user;
    logger.debug(`[update] contains password: ${toUpdate.password !== undefined}`);
    if (toUpdate.password !== undefined) {
      logger.silly('[update] encrypting new password');
      toUpdate.password = bcrypt.hashSync(user.password, Number(process.env.BCRYPT_SALT_ROUNDS));
    }
    return knex<IUser>('users').update(toUpdate).where('id', user.id);
  }

  static async deleteById(id: string) : Promise<number> {
    logger.silly('[delete] Hello!');
    return knex('users').delete().where({ id });
  }

  static async authenticateAndGet(email: string, password: string) : Promise<IUser | undefined> {
    logger.silly('[authenticateAndGet] Hello!');
    const foundUser = await knex('users')
      .select('*')
      .where({ email })
      .first();
    if (foundUser === undefined) {
      logger.silly('[authenticateAndGet] no user found with email `%s`', email);
      return undefined;
    }
    logger.debug('[authenticateAndGet] found user with email %s', foundUser.email);
    return bcrypt.compareSync(password, foundUser.password) ? foundUser : undefined;
  }
}
