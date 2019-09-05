import { QueryBuilder } from 'knex';
import db from '../../data/dbConfig';

const get = (): QueryBuilder<{}, {}> => {
  return db('posts');
};

const getById = (id: number): QueryBuilder<{}, {}> => {
  return db('posts')
    .where({ id })
    .first();
};

const insert = (post: { text: string; user_id: number }): Promise<{}> => {
  return db('posts')
    .insert(post)
    .then(ids => {
      return getById(ids[0]);
    });
};

const update = (
  id: number,
  changes: { text?: string; user_id?: number }
): QueryBuilder<{}, {}> => {
  return db('posts')
    .where({ id })
    .update(changes);
};

const remove = (id: number): QueryBuilder<{}, number> => {
  return db('posts')
    .where('id', id)
    .del();
};

export default {
  get,
  getById,
  insert,
  update,
  remove,
};
