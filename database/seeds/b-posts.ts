/* eslint-disable no-console */
import type { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('\x1b[33mApplication is not running in development mode, skipping seed...\x1b[0m');
    return Promise.resolve();
  }
  const result = await knex('posts').select();
  if (result.length !== 0) {
    console.warn('\x1b[33mTable ´posts´ already contains data, skipping seed...\x1b[0m');
    return Promise.resolve();
  }

  return knex('posts').insert([
    {
      id: uuid(),
      title: 'Dev Post Title #1',
      content: 'Lorem markdownum invenit opibusque aether grata ante laqueis quia, quae? Opus felicior vestras, tamen patet **Acastus** Phoebeis habentia minus, cornua haec Python tribuente tanta, lingua similisque dum. Ferro post relictus tantique hic pariterque quercum [obsequio tenet](http://quod.org/) et summa.',
      date: Date.now(),
    },
    {
      id: uuid(),
      title: 'Dev Post Title #2',
      content: 'Lorem markdownum invenit opibusque aether grata ante laqueis quia, quae? Opus felicior vestras, tamen patet **Acastus** Phoebeis habentia minus, cornua haec Python tribuente tanta, lingua similisque dum. Ferro post relictus tantique hic pariterque quercum [obsequio tenet](http://quod.org/) et summa.',
      date: Date.now(),
    },
    {
      id: uuid(),
      title: 'Dev Post Title #3',
      content: 'Lorem markdownum invenit opibusque aether grata ante laqueis quia, quae? Opus felicior vestras, tamen patet **Acastus** Phoebeis habentia minus, cornua haec Python tribuente tanta, lingua similisque dum. Ferro post relictus tantique hic pariterque quercum [obsequio tenet](http://quod.org/) et summa.',
      date: Date.now(),
    },
  ]);
}

export default seed;
