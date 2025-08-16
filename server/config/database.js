const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
  connectionTimeoutMillis: 10000, // avoid instant timeout
  idleTimeoutMillis: 30000, // close idle connections
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err);
});

module.exports = pool;
