import knex from 'knex';

const database = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/blog.db3',
  },
  pool: {
    afterCreate: (conn: { run: Function }, done: Function): void => {
      conn.run('PRAGMA foreign_keys = ON', done);
    },
  },
  migrations: {
    directory: './data/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './data/seeds',
  },
} as knex.Config;

export default database;
