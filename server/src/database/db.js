const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "admin",
    password: "postgres",
    port: 5432
})

module.exports = pool;
