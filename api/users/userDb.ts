import { QueryBuilder } from 'knex';
import db from '../../data/dbConfig';

const get = (): QueryBuilder<{}, {}> => {
  return db('users');
};

const getById = (id: number): QueryBuilder<{}, {}> => {
  return db('users')
    .where({ id })
    .first();
};

const getUserPosts = (userId: number): QueryBuilder<{}, {}> => {
  return db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('p.id', 'p.text', 'u.name as postedBy')
    .where('p.user_id', userId);
};

const insert = (user: { name: string }): Promise<{}> => {
  return db('users')
    .insert(user)
    .then(ids => {
      return getById(ids[0]);
    });
};

const update = (
  id: number,
  changes: { name: string }
): QueryBuilder<{}, number> => {
  return db('users')
    .where({ id })
    .update(changes);
};

const remove = (id: number): QueryBuilder<{}, number> => {
  return db('users')
    .where('id', id)
    .del();
};

export default {
  get,
  getById,
  getUserPosts,
  insert,
  update,
  remove,
};
