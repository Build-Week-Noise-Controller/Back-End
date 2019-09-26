module.exports = {
    development: {
      client: 'pg',
      connection: { user: 'noisecontroller', database: 'noisecontroller', password: 'noisecontroller' },
      migrations: {
        directory: './data/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './data/seeds' },
    },
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: './data/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './data/seeds' },
    },
    testing: {
      client: 'pg',
      connection: { user: 'noisecontroller', database: 'noisecontroller_testing', password: 'noisecontroller' },
      migrations: {
        directory: './data/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './data/seeds' },
    },
  };
  