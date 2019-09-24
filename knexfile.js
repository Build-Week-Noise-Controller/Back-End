module.exports = {
    development: {
      client: 'sqlite3',
      connection: { filename: './data/noiseControl.db3' },
      useNullAsDefault: true,
      migrations: {
        directory: './data/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './data/seeds' },
    },
    testing: {
      client: 'sqlite3',
      connection: { filename: './data/test.db3' },
      useNullAsDefault: true,
      migrations: {
        directory: './data/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './data/seeds' },
    },
  };
  