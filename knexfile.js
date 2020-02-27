// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: "postgresql://localhost/alliances-development",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations"
    }
  },

  testing: {
    client: "pg",
    connection: "postgresql://localhost/alliances-testing",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "pg",
    connection: "",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./database/migrations",
      tableName: "knex_migrations"
    }
  }
};
