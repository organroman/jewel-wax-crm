import * as dotenv from "dotenv";

dotenv.config();

import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/migrations",
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: process.env.STAGING_DB_HOST,
      user: process.env.STAGING_DB_USER_NAME,
      password: process.env.STAGING_DB_PASSWORD,
      database: process.env.STAGING_DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: process.env.PROD_DB_HOST,
      user: process.env.PROD_DB_USER_NAME,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
  },
};

export default config;
