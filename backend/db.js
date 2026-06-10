// Dialect is picked from DATABASE_URL so the same config works locally (SQLite)
// and in production (Postgres) without any code changes.
import { Sequelize } from "sequelize";

let sequelize;
let dbKind;

const url = process.env.DATABASE_URL || "";

if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
  dbKind = "postgres";
  // Coolify-internal Postgres runs on the private Docker network without SSL;
  // external managed Postgres (e.g. Neon) needs SSL and carries ?sslmode=require.
  const needsSsl = /sslmode=require/i.test(url);
  sequelize = new Sequelize(url, {
    dialect: "postgres",
    logging: false,
    dialectOptions: needsSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  });
} else {
  dbKind = "sqlite";
  if (process.env.NODE_ENV === "production") {
    // Container filesystems are ephemeral — without DATABASE_URL all data is lost on redeploy.
    console.warn("WARNING: running in production on SQLite (DATABASE_URL not set) — data will not persist across deploys.");
  }
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.SQLITE_PATH || "./data.sqlite",
    logging: false,
  });
}

export { sequelize, dbKind };
