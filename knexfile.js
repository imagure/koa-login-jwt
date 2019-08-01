const path = require('path');

const BASE_PATH = path.join(__dirname, 'src/db');

module.exports = {
  local_test: {
    client: 'pg',
    connection: {
            host: "127.0.0.1",
            user: "postgres",
            password: "postgres",
            database: "koa_login_jwt_test"
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: {
            host: "127.0.0.1",
            user: "postgres",
            password: "postgres",
            database: "koa_login_jwt"
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};
