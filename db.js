const { Pool } = require('pg');

// Configure your PostgreSQL connection here
const pool = new Pool({
  user: 'postgres',       // Replace with your DB username
  host: 'localhost',      // DB host (usually localhost)
  database: 'cvbuilder',  // Replace with your DB name
  password: '1122',      // PostgreSQL password
  port: 5432,             // Default PostgreSQL port
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};
